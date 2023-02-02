
import type { TStepParentAst, TStepAst } from '@GBR/types'


import { ESectionType } from '@GBR/types'

import {
  StepGridItem
} from './Steps.styled'

export type TSelectAction = {
  step: TStepAst
}

export const SelectAction = (props:TSelectAction) => {
  
  return (
    <StepGridItem>
      <select>
        <option>
          Action 1
        </option>
        <option>
          Action 2
        </option>
      </select>
    </StepGridItem>
  )
  
}