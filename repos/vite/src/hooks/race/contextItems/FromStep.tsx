import type { MouseEvent } from 'react'
import type { TMenuItem } from '@gobletqa/components'
import type {
  TAudit,
  TExpPart,
  TRaceStep,
  TRaceFeature,
  TRaceMenuItemClickCtx,
} from '@gobletqa/race'

import { isStr } from '@keg-hub/jsutils'
import { EAstObject } from '@ltipton/parkin'
import { FootIcon } from '@gobletqa/components'

const getAllStep = (feature:TRaceFeature) => {
  const { rules, background, scenarios } = feature
  const steps:Record<string, TRaceStep> = {}

  background
    && background?.steps?.forEach(step => steps[step.uuid] = step)
  
  scenarios?.length
    && scenarios.forEach(scenario => scenario?.steps?.forEach(step => steps[step.uuid] = step))

  rules?.length
    && rules.forEach(({ background, scenarios }) => {
      background
        && background?.steps?.forEach(step => steps[step.uuid] = step)
      
      scenarios?.length
        && scenarios.forEach(scenario => scenario?.steps?.forEach(step => steps[step.uuid] = step))
    })

  return steps
}


const generateStepItems = (ctx:TRaceMenuItemClickCtx) => {
  const { feature, audit, onChange } = ctx
  // const steps = getAllStep(feature)

  return Object.entries(audit as TAudit).reduce((acc, [id, match]) => {
    const { expressions } = match
    // const step = steps[id]

    ;(expressions as TExpPart[]).map(exp => {
      exp.value
        && (!isStr(exp.value) || !exp.value.startsWith(`$$`))
        && acc.push({
            text: `Step: ${exp.value}`,
            closeMenu: true,
            closeParent:true,
            onClick: () => {
              onChange({target: { value: exp.value, tagName: `INPUT` }})
            }
          })
    })

    return acc
  }, [] as TMenuItem[])

}

export const FromStep = {
  Icon: FootIcon,
  closeMenu: false,
  text: `From Step`,
  type: EAstObject.expression,
  id: `expression-from-step`,
  onClick: (ctx:TRaceMenuItemClickCtx, evt:MouseEvent<HTMLElement>) => {
    const { onSubmenu } = ctx

    onSubmenu(evt, {
      open: true,
      items: generateStepItems(ctx)
    })
    
  }
}