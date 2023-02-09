import type { TStepAst } from '@GBR/types'
import { ESectionType } from '@GBR/types'
import { AddAct } from '../Actions/Add'
import { PlayAct } from '../Actions/Play'
import { CopyAct } from '../Actions/Copy'
import { DeleteAct } from '../Actions/Delete'
import { SectionActions } from '../Section/SectionActions'
import {
  StepHeaderText,
  StepCardHeader,
  StepActionsContainer
} from './Steps.styled'
import { capitalize } from '@keg-hub/jsutils'

export type TStepHeader = {
  step: TStepAst
}

const styles = {
  actions: {
    opacity: 1
  },
  action: {
    width: `20px`,
    height: `20px`,
    [`& svg`]: {
      width: `18px`,
      height: `18px`,
    },
  }
}

const actions = [
  (
    <PlayAct
      sx={styles.action}
      onClick={() => {}}
      type={ESectionType.step}
      key={`gr-step-play-step-action`}
    />
  ),
  (
    <CopyAct
      sx={styles.action}
      onClick={() => {}}
      type={ESectionType.step}
      key={`gr-step-copy-step-action`}
    />
  ),
  (
    <DeleteAct
      sx={styles.action}
      onClick={() => {}}
      type={ESectionType.step}
      key={`gr-step-remove-step-action`}
    />
  ),
  
]

export const StepHeader = (props:TStepHeader) => {
  const {
    step
  } = props

  return (
    <StepCardHeader>
      <StepHeaderText>
        <b>{capitalize(step.type)}</b> {step.step}
      </StepHeaderText>
      <StepActionsContainer>
        <SectionActions
          actions={actions}
          sx={styles.actions}
        />
      </StepActionsContainer>
    </StepCardHeader>
  )
}