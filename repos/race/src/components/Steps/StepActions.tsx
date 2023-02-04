
import type { TStepParentAst, TStepAst } from '@GBR/types'

import { ESectionType } from '@GBR/types'

import {
  StepGridItem
} from './Steps.styled'

export type TStepActions = {
  step:TStepAst
  parent:TStepParentAst
}

export const StepActions = (props:TStepActions) => {

  return (
    <StepGridItem>
      
    </StepGridItem>
  )
  
}