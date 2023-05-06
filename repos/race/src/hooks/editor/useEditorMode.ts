import type { TEditorProvider } from '@GBR/contexts'

import { EEditorMode } from '@GBR/types'
import { useState } from 'react'
import { useInline } from '@gobletqa/components'

export type THEditorMode = {
  mode?:EEditorMode
}


export const useEditorMode = (props:THEditorMode) => {
  const [mode, setMode] = useState<EEditorMode>(props.mode || EEditorMode.simple)
  const updateMode = useInline((update:EEditorMode) => update !== mode && setMode(update))
  
  return {
    mode,
    setMode,
    updateMode,
  }
}