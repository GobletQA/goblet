import type { TStepParentAst, TStepAst } from '@GBR/types'

import {
  StepGridItem
} from './Steps.styled'

export type TModifier = {
  step: TStepAst
}

export const Modifier = (props:TModifier) => {
  return (
    <StepGridItem>
      Modifier
    </StepGridItem>
  )
}