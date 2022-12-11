import type { TDefinitionFileModel, TDefinitionAst, TDefStepTypeGroups } from '@GSH/types'

import { get, isArr } from '@keg-hub/jsutils'


/**
 * Extracts the definitions code from a definitions fileModel
 * Then organizes them by the step type ( given | then | when )
 */
export const definitionsByType = (defFileModels:TDefinitionFileModel[]) => {
  const defStepTypes = {} as TDefStepTypeGroups

  return isArr(defFileModels)
    ? defFileModels.reduce((organized, fileModel, idx) => {
        get<TDefinitionAst[]>(fileModel, 'ast.definitions', [])
          .map(definition => {
            if (!definition || !definition.type) return

            const type = definition.type.toLowerCase()
            // Store a reference to the parent fileModel to allow finding it later
            definition.parent = {
              uuid: fileModel.uuid,
              location: fileModel.location,
            }

            organized[type] = organized[type] || []
            organized[type].push(definition)
          })

        return organized
      }, defStepTypes)
    : defStepTypes
}
