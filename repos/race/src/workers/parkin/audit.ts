import type {
  TAudit,
  TRaceStep,
  TMatchExpRes,
  TMatchExpReq,
  TRaceFeature,
  TAuditFeature,
  TRaceStepParent,
} from '@GBR/types'

import type { Parkin, TStepDef } from '@ltipton/parkin'

import { stepTokens } from '@GBR/utils/steps/stepTokens'
import { mapStepTokens } from '@GBR/utils/steps/mapStepTokens'
import { getMatchExpressions } from '@GBR/utils/steps/getMatchExpressions'


export const auditExpressions = async (props:TMatchExpReq) => {
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
  const tokens = stepTokens({def, parkin, step: step.step})

  /**
   * Maps expressions to Parkin parameters, with parameters overriding expression meta-data
   * They are matched by type, so expression.type **MUST** match parameter.type
   */
  const expressions = mapStepTokens({ exps, tokens })

  return {
    def,
    tokens,
    expressions
  }
}

const auditStep = () => {
  
}

const auditBackground = () => {
  
}

const auditScenario = () => {
  
}

const auditRule = () => {
  
}

export const auditFeature = async (props:TAuditFeature, parkin:Parkin) => {

  

  return {} as TAudit
}