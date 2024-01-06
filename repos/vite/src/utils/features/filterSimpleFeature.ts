import type { TFeatureAst } from '@gobletqa/race'
import type { TFileModel, TStartBrowserPlayOpts } from '@types'

import { FileTypes } from '@constants'
import { emptyObj } from '@keg-hub/jsutils'
import { EEditorMode, SimpleScenarioTag } from '@gobletqa/race'

import { getEditorSettings } from '@utils/editor/getEditorSettings'

const findSimpleTag = (feature:TFeatureAst) => {
  return feature.scenarios.find(scenario => scenario?.tags?.tokens?.includes(SimpleScenarioTag))
}

export const filterSimpleFeature = async (
  file:TFileModel,
  filterOpts:TStartBrowserPlayOpts=emptyObj
):Promise<TFileModel> => {
  if(file?.fileType !== FileTypes.FEATURE) return file

  if(filterOpts.ast)
    return {...file, ast: [filterOpts.ast]}

  const { settings } = await getEditorSettings()

  if(!settings || settings?.mode !== EEditorMode.simple || !file?.ast?.[0])
    return file

  const feat = file?.ast?.[0]
  const scenario = findSimpleTag(feat)

  return {
    ...file,
    ast: [{
      ...feat,
      rules: [],
      background: undefined,
      scenarios: [scenario]
    }]
  }
}
