import type { MutableRefObject } from 'react'
import type {
  TFilelist,
  TCodeEditor,
  TPathChange,
  TCodeEditorRef,
  TOnEditorLoaded,
  TEditorOpenFiles,
} from '@GBM/types'

import { isStr } from '@keg-hub/jsutils'
import { useEffectOnce } from '@gobletqa/components'
import { getModelFromPath } from '@GBM/utils/editor/getModelFromPath'
import { createOrUpdateModel } from '@GBM/utils/editor/createOrUpdateModel'

export type THEditorFiles = {
  pathChange:TPathChange
  editorRef:TCodeEditorRef
  openedFiles: TEditorOpenFiles
  onEditorLoaded?:TOnEditorLoaded
  filesRef: MutableRefObject<TFilelist>
}


/**
 * Hook that runs on load of the editor component
 * Creates monaco models for each of the defaultFiles
 * that get set to the filesRef in the editor component
 * Next, loops over the openedFiles
 * Find the first opened file with a monaco model, and makes it active
 * Finally, it calls the onEditorLoaded callback if it exists
 */
export const useEditorFiles = (props:THEditorFiles) => {

  const {
    filesRef,
    editorRef,
    pathChange,
    openedFiles,
    onEditorLoaded,
  } = props

  useEffectOnce(() => {
    Object.keys(filesRef.current).forEach(key => {
      const content = filesRef.current[key]

      ;(isStr(content) || content === null)
        && createOrUpdateModel(key, content)
    })
    
    /**
     * TODO: Allow passing in the an active file path
     * Should match the path of one of the opened files
     * If found, then set that file as active
     * Instead of the first found file with a model
     */
    openedFiles?.length
      && setTimeout(() => {
        // Find the first opened file with a model and set it as active
        const found = openedFiles.find(file => getModelFromPath(file.path))
        found && pathChange(found.path, { storage: false })
    }, 0)

    if(!editorRef.current) return

    onEditorLoaded?.(editorRef.current as TCodeEditor, window.monaco)

  })

}
