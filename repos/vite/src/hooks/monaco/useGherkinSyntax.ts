import type { IEditor, TMonaco, TDefinitionsAstTypeMap, } from '@types'

import { useCallback } from 'react'
import { flatArr, noPropArr } from '@keg-hub/jsutils'

export const useGherkinSyntax = (definitionTypes:TDefinitionsAstTypeMap) => {
  return useCallback(async (
    editor:IEditor,
    monaco:TMonaco
  ) => {
      const defs = flatArr(Object.values(definitionTypes), { truthy: true, exists: true, mutate:false })
        .map(def => ({
          suggestion: def.match,
          segments: [def.match],
          expression: def.variant,
        }))

      const findStepDefMatch = (matchText:string) => {
        return defs.filter(def => (
          def.suggestion
            .toLowerCase()
            .includes(matchText.toLowerCase())
        ))
      }

    import('@utils/features/addGherkinSyntax')
      .then(({ addGherkinToMonaco }) => {
        addGherkinToMonaco(monaco, findStepDefMatch, noPropArr)
        /*
          TODO: For this to work, need something like Parkin.steps.match method
          Which will match feature step to a step definition
          text - feature step
          def - parsed definition
          Would then allow showing steps with no matching definition
          Use the getDefinitionFromId helper method to find the matching definition
          Looks something like
          getDefinitionFromId(definitionTypes, step.definition, step.type)
          configureMonaco(monaco, findStepDefMatch, defs.map(def => ({
            match: text => {
            }
          })))(editor)
        */
      })
  }, [definitionTypes])
}