
import { EEditorMode } from '@GBR/types'
import { useState } from 'react'
import { useInline } from '@gobletqa/components'

export type THEditorMode = {
  mode?:EEditorMode
}

/**
 * TODO: If user switches to advanced mode, Need to save setting in local storage
 */
export const useEditorMode = (props:THEditorMode) => {
  const [mode, setMode] = useState<EEditorMode>(props.mode || EEditorMode.simple)
  const updateMode = useInline((update:EEditorMode) => update !== mode && setMode(update))
  
  return {
    mode,
    setMode,
    updateMode,
  }
}