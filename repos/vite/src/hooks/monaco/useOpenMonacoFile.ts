import type { TStepDef } from '@ltipton/parkin'
import type { MutableRefObject } from 'react'
import type { TEditorRefHandle } from '@gobletqa/monaco'

import { OpenEditorFileEvt } from '@constants'
import { useOnEvent } from '@gobletqa/components'
import { rmRootFromLoc } from '@utils/repo/rmRootFromLoc'
import { isCustomDef } from '@utils/definitions/isCustomDef'
import { loadGobletFile } from '@actions/files/api/loadGobletFile'


export type THOpenMonacoFile = {
  rootPrefix:string
  editorRef:MutableRefObject<TEditorRefHandle|null>
}

/**
 * Custom hook for opening files externally within monaco editor
 * Event listener to open files from a custom location when the event is fired
 * Allows opening files like step defs from the step def drawer
 */
export const useOpenMonacoFile = (props:THOpenMonacoFile) => {

  const {
    editorRef,
    rootPrefix
  } = props

  useOnEvent<TStepDef>(OpenEditorFileEvt, async (defAst:TStepDef) => {
    const { location } = defAst

    if(!location)
      return console.warn(`[Error: ${OpenEditorFileEvt}] - Missing step def location`)

    // If it's a custom file then it should already be loaded
    if(isCustomDef(location)){
      const relative = rmRootFromLoc(location, rootPrefix)
      editorRef?.current?.openFile?.(relative)
      return
    }

    // If it's a goblet file, then load it
    // And then make call to open it in the editor
    const loaded = await loadGobletFile(location)
    if(!loaded) return

    setTimeout(() => {
      const relative = rmRootFromLoc(loaded.location, rootPrefix)
      editorRef?.current?.openFile?.(relative, loaded.content)
    }, 50)

  })
}
