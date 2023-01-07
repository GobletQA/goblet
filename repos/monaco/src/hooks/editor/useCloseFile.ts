import type { editor } from 'monaco-editor'
import type { SetStateAction, MutableRefObject } from 'react'
import type { TFilelist, TAutoSave, TEditorOpenFiles } from '../../types'


import { useCallback } from 'react'
import { exists } from '@keg-hub/jsutils'
import { saveFile } from '../../utils/file/saveFile'

export type TUseCloseFile = {
  autoSave: TAutoSave
  openedFiles: TEditorOpenFiles
  curPathRef: MutableRefObject<string>
  filesRef: MutableRefObject<TFilelist>
  openedPathRef: MutableRefObject<string | null>
  setCurPath: (data: SetStateAction<string>) => void
  onSaveFile?: (path: string, content: string) => void
  restoreModel: (path: string) => false | editor.ITextModel
  setOpenedFiles: (data: SetStateAction<TEditorOpenFiles>) => void
}

/**
 * Clears all opened files
 * Is called when the last file in the openedFiles array is closed
 */
const clearPath = (
  openedPathRef:MutableRefObject<string | null>,
  restoreModel:(path: string) => false | editor.ITextModel,
  setCurPath:(data: SetStateAction<string>) => void
) => {
  restoreModel?.('')
  setCurPath?.('')
  openedPathRef.current = ''
}

/**
 * Updates the current active file to be the file from the passed in targetPath
 * Sets the curPathRef.current value
 */
const updateTargetPath = (
  targetPath:string,
  restoreModel:(path: string) => false | editor.ITextModel,
  setCurPath:(data: SetStateAction<string>) => void
) => {
  restoreModel?.(targetPath)
  setCurPath?.(targetPath)
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
    autoSave,
    filesRef,
    onSaveFile,
    curPathRef,
    setCurPath,
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
            && file.status === 'editing'
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
         * Then do nothing, because it should say active
         *
         * If no targetPath, it means no files are left open
         * So clear out all paths
         */
        targetPath
          ? targetPath !== path
              && curPathRef.current === path
              && updateTargetPath(targetPath, restoreModel, setCurPath)
          : filesOpened.length === 0
              && clearPath(openedPathRef, restoreModel, setCurPath)

        return filesOpened

      })
    },
    [autoSave, onSaveFile, restoreModel, openedFiles]
  )
}