import type { editor } from 'monaco-editor'
import type { SetStateAction, MutableRefObject } from 'react'
import type {
  TFilelist,
  TAutoSave,
  TPathChange,
  TEditorOpenFiles
} from '../../types'


import { useCallback } from 'react'
import { exists, ife } from '@keg-hub/jsutils'
import { saveFile } from '../../utils/file/saveFile'

export type TUseCloseFile = {
  curPath:string
  autoSave: TAutoSave
  pathChange: TPathChange
  openedFiles: TEditorOpenFiles
  filesRef: MutableRefObject<TFilelist>
  openedPathRef: MutableRefObject<string | null>
  onSaveFile?: (path: string, content: string) => void
  restoreModel: (path: string) => false | editor.ITextModel
  setOpenedFiles: (data: SetStateAction<TEditorOpenFiles>) => void
}

/**
 * With the closed file path removed
 * Reuse the it's index to find the next file that should be opened
 * If no files exist at that index, then go to the index before it
 */
const getNextOpened = (
  openedFiles:TEditorOpenFiles,
  idx:number|undefined
):string|undefined => {
  /**
   * If no index, or no files are open, return undefined
   * Which will clear all opened files 
   *
   * If there is an index and opened files
   * Then check if the path exists for the current index
   * Or call getNextOpened again, and subtract 1 from the current index
   * This allows working backwards from the current index down to 0
   */
  return !exists(idx) || !openedFiles.length
    ? undefined
    : openedFiles[idx as number]?.path
        || getNextOpened(openedFiles, (idx  as number) - 1)
}

const resolveFileOpened = (
  openedFiles:TEditorOpenFiles,
  path:string,
) => {

  /**
   * Filer out the path of the file to be closed
   * And capture its index in the openedFiles array
   * Then use that index to find the next file that should be open
   */
  let index:number|undefined
  const filesOpened = openedFiles.filter((loc, idx) => {
    const pathMatch = loc.path === path
    pathMatch && (index = idx)

    return !pathMatch
  })

  return {
    filesOpened,
    targetPath: getNextOpened(filesOpened, index)
  }
}

/**
 * Closes a file and loops through the other opened files
 * Finds which file should become the next active file
 * After the current file is closed
 */
export const useCloseFile = (props:TUseCloseFile) => {
  const {
    curPath,
    autoSave,
    filesRef,
    onSaveFile,
    pathChange,
    openedFiles,
    restoreModel,
    openedPathRef,
    setOpenedFiles
  } = props

  // TODO: Need to add modal confirm, in some cases it needs to be shown
  return useCallback(
    (path: string) => {

      // Check if the file was changed and call onSaveFile if needed
      autoSave !== `off`
        && openedFiles.forEach(file => {
          file.path === path
            && file.status === `editing`
            && saveFile(file, filesRef, onSaveFile)
        })

      setOpenedFiles(openedFiles => {
        if(!openedFiles?.length) return openedFiles

        const { filesOpened, targetPath } = resolveFileOpened(openedFiles, path)

        /**
         * If there's a target path
         * And it's not equal to the path being closed
         * And the current active path is equal to the path being closed
         * Then set the targetPath as the active path
         * If the current active path is not equal to the close path
         * Then do nothing, because it should stay active
         *
         * If no targetPath, it means no files are left open
         * So clear out all paths
         */
        targetPath
          ? targetPath !== path
              && curPath === path
              && pathChange(targetPath, { openLoc: false, oldLoc: curPath })
          : filesOpened.length === 0
              && ife(() => {
                  pathChange(``, { openLoc: false, oldLoc: curPath })
                  openedPathRef.current = ''
                })

        return filesOpened

      })
    },
    [
      curPath,
      autoSave,
      pathChange,
      onSaveFile,
      openedFiles,
      restoreModel,
    ]
  )
}