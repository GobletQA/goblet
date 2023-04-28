import type { TEditorProvider } from '@GBR/contexts'

import { useState, useCallback } from 'react'
import { EEditorMode } from '@GBR/types'

export type THEditorMode = {
  mode?:EEditorMode
}


export const useEditorMode = (props:THEditorMode) => {
  const [mode, setMode] = useState<EEditorMode>(props.mode || EEditorMode.simple)

  const updateMode = useCallback((update:EEditorMode) => {
    update !== mode && setMode(update)
  }, [mode])
  
  return {
    mode,
    setMode,
    updateMode,
  }
}