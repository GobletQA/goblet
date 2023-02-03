
import type { TStepParentAst, TStepAst } from '@GBR/types'

import { ESectionType } from '@GBR/types'

import {
  StepGridItem
} from './Steps.styled'

export type TSelectSubject = {
  step: TStepAst
  parent:TStepParentAst
  onStepChange:(step:TStepAst) => void
}

export const SelectSubject = (props:TSelectSubject) => {
  
  return (
    <StepGridItem>
      <select>
        <option>
          Subject 1
        </option>
        <option>
          Subject 2
        </option>
      </select>
    </StepGridItem>
  )
  
}