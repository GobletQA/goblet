import type { Parkin } from '@ltipton/parkin'
import type {
  TAudit,
  TRaceStep,
  TRaceGran,
  TMatchExpRes,
  TMatchExpReq,
  TRaceFeature,
} from '@GBR/types'

import { stepTokens } from '@GBR/utils/steps/stepTokens'
import { mapStepTokens } from '@GBR/utils/steps/mapStepTokens'
import { matchStepToDef } from '@GBR/utils/steps/matchStepToDef'
import { getMatchExpressions } from '@GBR/utils/steps/getMatchExpressions'

const auditExpressions = (props:TMatchExpReq) => {
  const {
    def,
    step,
    parkin
  } = props

  /**
   * An expensive process of matching a definition with expression
   *  
   */
  const exps = getMatchExpressions({ def, parkin })

  /**
   * Get the tokens from the current step string for all definition expressions
   */
  const tokens = stepTokens({ def, parkin, step: step.step })

  /**
   * Maps expressions to Parkin parameters, with parameters overriding expression meta-data
   * They are matched by type, so expression.type **MUST** match parameter.type
   */
  const expressions = mapStepTokens({ exps, tokens })

  return {
    def,
    expressions
  } as TMatchExpRes
}

const auditStep = (
  parkin:Parkin,
  audit:TAudit,
  item:TRaceStep
) => {

  const {
    step,
    definition:def
  } = matchStepToDef({ step: item, parkin })

  if(!def) return

  audit[step.uuid] = auditExpressions({
    def,
    step,
    parkin,
  })
}

const auditSteps = (
  parkin:Parkin,
  audit:TAudit,
  steps:TRaceStep[]
) => {
  steps?.length
   && steps.forEach(step => auditStep(parkin, audit, step))
}

const auditFromGran = (
  parkin:Parkin,
  audit:TAudit,
  grans:TRaceGran[]
) => {
  grans.forEach((gran) => {

    (gran as TRaceFeature).feature
      && (gran as TRaceFeature).rules?.length
      && auditFromGran(
          parkin,
          audit,
          (gran as TRaceFeature).rules as TRaceGran[],
        )
    
    gran.background
      && auditSteps(parkin, audit, gran.background.steps)

    gran.scenarios?.length
      && gran.scenarios.forEach(scenario => auditSteps(parkin, audit, scenario.steps))

  })

  return audit
}

export const auditFeature = (parkin:Parkin, feature:TRaceFeature) => {
  return auditFromGran(parkin, {}, [feature])
}