import type { MutableRefObject } from 'react'
import type {
  TAutoSave,
  TFilelist,
  TEditorOpts,
  TCodeEditorRef,
  TEditorFileCBRef,
  TEditorOpenFiles,
} from '@GBM/types'

import { useCallback, useEffect } from 'react'
import { getContentFromPath } from '@GBM/utils/editor/getContentFromPath'

export type TUseEditorSetup = {
  curPath: string
  autoSave: TAutoSave
  saveFile: () => void
  options: TEditorOpts
  editorRef:TCodeEditorRef
  openedFiles: TEditorOpenFiles
  closeFile:(path: string) => void
  onEditorBlurRef: TEditorFileCBRef
  onEditorFocusRef: TEditorFileCBRef
  filesRef: MutableRefObject<TFilelist>
}

export const useEditorFocus = (props:TUseEditorSetup) => {

  const {
    curPath,
    options,
    filesRef,
    autoSave,
    saveFile,
    editorRef,
    closeFile,
    openedFiles,
    onEditorBlurRef,
    onEditorFocusRef,
  } = props

  const onEditorFocus = useCallback(() => {
    const content = getContentFromPath(curPath) || filesRef.current[curPath]
    onEditorFocusRef.current?.(curPath, content)
  }, [curPath])

  const onEditorBlur = useCallback(() => {
    const content = getContentFromPath(curPath) || filesRef.current[curPath]
    if(!content) return

    const file = openedFiles.find(file => file.path === curPath)
    const isEditing = file?.status === `editing`

    // Check if save on blur and the file was changed
    if(autoSave === `blur` && isEditing) saveFile()

    // TODO: find way to know if the event that called this was an action within the editor
    // If a close file action is called for a diff file that is also open
    // Then this event is called as well
    // see onCloseTab in useOnTabClose hook

    // Check if we should auto close the file when not edited
    if(options.openMode === `preview` && file && file?.mode !== `keep`){
      if(!isEditing) closeFile(curPath)
      else file.mode = `keep`
    }

    // Call passed in callbacks
    onEditorBlurRef?.current?.(curPath, content)

  }, [
    curPath,
    autoSave,
    saveFile,
    closeFile,
    openedFiles,
    options.openMode,
  ])

  /**
   * Sets up callbacks for focus and blur of the editor
   */
  useEffect(() => {
    if(!editorRef.current) return

    const blurDispose = editorRef.current.onDidBlurEditorText(onEditorBlur)
    const focusDispose = editorRef.current.onDidFocusEditorText(onEditorFocus)

    return () => {
      blurDispose?.dispose?.()
      focusDispose?.dispose?.()
    }

  }, [onEditorFocus, onEditorBlur])

}