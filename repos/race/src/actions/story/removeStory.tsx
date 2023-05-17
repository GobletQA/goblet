import type { TRaceFeature } from '@GBR/types'

import { omitKeys } from '@keg-hub/jsutils'
import { RedText } from '@gobletqa/components'
import { openYesNo } from '@GBR/actions/general/toggleConfirm'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'

export const removeStory = async (parent?:TRaceFeature) => {
  const { feature } = await getFeature(parent)
  if(!feature) return

  return await openYesNo({
    title: `Delete feature story`,
    text: (
      <>
        Are you sure your want to delete the <b><RedText>feature story</RedText></b>?
      </>
    ),
    yes: {
      onClick: () => {
        updateFeature(
          omitKeys<TRaceFeature>(feature, [`perspective`, `reason`, `desire`]),
          { skipAudit: true }
        )
      }
    }
  })
}