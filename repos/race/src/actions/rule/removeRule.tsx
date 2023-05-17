import type { TRaceRule, TRaceFeature } from '@GBR/types'

import { RedText } from '@gobletqa/components'
import { logNotFound } from '@GBR/utils/logging'
import { openYesNo } from '@GBR/actions/general/toggleConfirm'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'

export type TRemoveRule = {
  ruleId:string
  persist?:Boolean
  feature?:TRaceFeature
}

export const removeRule = async (props:TRemoveRule) => {
  const {
    ruleId,
    persist,
  } = props
  
  const { feature } = await getFeature(props.feature)
  if(!feature) return logNotFound(`feature`, `[Remove Rule]`)

  let rule:TRaceRule|undefined
  const rules = feature?.rules?.filter(rl => {
    if(rl.uuid !== ruleId) return true

    rule = rl
    return false
  })

  return await openYesNo({
    title: `Delete ${rule?.rule}`,
    text: (
      <>
        Are you sure your want to delete rule <b><RedText>{rule?.rule}</RedText></b>?
      </>
    ),
    yes: {
      onClick: () => {
        const update = {...feature, rules}
        persist !== false && updateFeature(update, { removeAuditSteps: true })

        return update
      }
    }
  })
}