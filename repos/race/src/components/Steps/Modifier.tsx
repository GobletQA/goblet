import type { TStepParentAst, TStepAst } from '@GBR/types'

import {
  StepGridItem
} from './Steps.styled'

export type TModifier = {
  step: TStepAst
  parent:TStepParentAst
  onStepChange:(step:TStepAst) => void
}

export const Modifier = (props:TModifier) => {
  return (
    <StepGridItem>
      Modifier
    </StepGridItem>
  )
}