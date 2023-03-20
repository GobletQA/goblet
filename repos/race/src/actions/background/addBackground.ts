import { logNotFound, factoryFailed } from '@GBR/utils/logging'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { backgroundFactory } from '@GBR/factories/backgroundFactory'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'

const prefix = `[Add Background]`
export const addBackground = async () => {
  const { feature } = await getFeature()
  if(!feature) return logNotFound(`feature`, prefix)

  const background = backgroundFactory({feature, empty: true })
  if(!background) return factoryFailed(`background`, prefix)
  
  // TODO: background not being saved ???
  updateFeature({...feature, background}, { expand: background.uuid })
}