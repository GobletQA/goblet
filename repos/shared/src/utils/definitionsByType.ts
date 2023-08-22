import type { TStepDef } from '@ltipton/parkin'
import type { TDefinitionFileModel, TDefTypeGroup } from '@GSH/types'

import { get } from '@keg-hub/jsutils/get'
import { isArr } from '@keg-hub/jsutils/isArr'


/**
 * Extracts the definitions code from a definitions fileModel
 * Then organizes them by the step type ( given | then | when )
 */
export const definitionsByType = (defFileModels:TDefinitionFileModel[]) => {
  const defStepTypes = {} as TDefTypeGroup

  return isArr(defFileModels)
    ? defFileModels.reduce((organized, fileModel, idx) => {
        get<TStepDef[]>(fileModel, 'ast.definitions', [])
          .map(definition => {
            if (!definition || !definition.type) return

            const type = definition.type.toLowerCase()

            organized[type] = organized[type] || []
            organized[type].push({
              ...definition,
              // Store a reference to the parent fileModel to allow finding it later
              parent: {
                uuid: fileModel.uuid,
                location: fileModel.location
              }
            })
          })

        return organized
      }, defStepTypes)
    : defStepTypes
}
