import type { TEditorConfig } from '@gobletqa/monaco'

import { useMemo } from 'react'
import { deepMerge } from '@keg-hub/jsutils'

const defConfig:TEditorConfig = {}

export const useMonacoConfig = (config?:TEditorConfig) => {
  return useMemo(() => {
    return config
      ? deepMerge<TEditorConfig>(defConfig, config)
      : defConfig
  }, [config])
}