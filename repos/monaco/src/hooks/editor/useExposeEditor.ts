import type { ForwardedRef, MutableRefObject } from 'react'
import type {
  TMonaco,
  TFilelist,
  TPathChange,
  TEditorTheme,
  IMultiRefType,
  TDecorationFns,
  TPathChangeOpts,
  TEditorRefHandle,
} from '@GBM/types'

import { THEMES } from '@GBM/constants'
import { isStr } from '@keg-hub/jsutils'
import { useCallback, useImperativeHandle } from 'react'
import { createOrUpdateModel } from '@GBM/utils/editor/createOrUpdateModel'

export type THExposeEditor = {
  pathChange:TPathChange
  decoration: TDecorationFns
  ref: ForwardedRef<IMultiRefType>
  closeFile:(path: string) => void
  filesRef: MutableRefObject<TFilelist>
  resizeSidebar: (width:number) => void
  setTheme: (name: string, themeObj?: TEditorTheme | undefined, monaco?:TMonaco) => Promise<void>
}

export const useExposeEditor = (props:THExposeEditor) => {

  const {
    ref,
    filesRef,
    setTheme,
    closeFile,
    pathChange,
    decoration,
    resizeSidebar,
  } = props

  /**
   * Function exposed to the host application
   * Allows opening files externally to the editor
   */
  const openFile = useCallback((
    path:string,
    content?:string,
    opts?:TPathChangeOpts
  ) => {

    if(isStr(content)){
      createOrUpdateModel(path, content)
      filesRef.current[path] = content
    }

    pathChange(path, opts)
  }, [])


  /**
   * Ref is passed in externally, to give access to the monaco editor and helper methods 
   */
  useImperativeHandle(ref, () => ({
    openFile,
    setTheme,
    closeFile,
    decoration,
    resizeSidebar,
    getSupportThemes: () => THEMES,
    getEditorFiles: () => filesRef.current,
    getFileContent: (path: string) => filesRef.current[path],
  } as TEditorRefHandle))

}