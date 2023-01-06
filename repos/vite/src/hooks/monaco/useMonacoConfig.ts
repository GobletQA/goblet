import type {  TEditorConfig, TMonacoDefinition } from '@gobletqa/monaco'

import { useMemo } from 'react'
import { useDefs } from '@store'
import { flatArr, deepMerge } from '@keg-hub/jsutils'

const defConfig:TEditorConfig = { theme: { name: '' }}
const flatOpts = { truthy: true, exists: true, mutate: false }

const useGherkinConfig = () => {
  const defs = useDefs()
  return useMemo(() => {
    return {
      gherkin: {
        definitions: flatArr(Object.values(defs.definitionTypes), flatOpts)
        .map(def => ({
          suggestion: def.match,
          segments: [def.match],
          expression: def.variant,
        } as TMonacoDefinition))
      }
    }
  }, [defs?.definitionTypes])
}

export const useMonacoConfig = (config?:TEditorConfig) => {

  const gherkin = useGherkinConfig()
  return useMemo(() => {
    return config
      ? deepMerge<TEditorConfig>(defConfig, config, gherkin)
      : deepMerge<TEditorConfig>(defConfig, gherkin)

  }, [config, gherkin])
}