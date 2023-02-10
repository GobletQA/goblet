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
  onCopy?:(stepId:string, parentId?:string) => void
  onRemove?:(stepId:string, parentId?:string) => void
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



export const StepHeader = (props:TStepHeader) => {
  const {
    step,
    onCopy,
    onRemove
  } = props

  return (
    <StepCardHeader>
      <StepHeaderText>
        { 
          step.step
            ? (<span><b>{capitalize(step.type)}</b> {step.step}</span>)
            : (<b>Step</b>)
        }
        
      </StepHeaderText>
      <StepActionsContainer>
        <SectionActions
          sx={styles.actions}
          actions={[
            (
              <PlayAct
                sx={styles.action}
                onClick={() => {}}
                type={ESectionType.step}
                key={`gr-step-play-step-action`}
              />
            ),
            onCopy && (
              <CopyAct
                sx={styles.action}
                onClick={() => {}}
                type={ESectionType.step}
                key={`gr-step-copy-step-action`}
              />
            ),
            onRemove && (
              <DeleteAct
                sx={styles.action}
                onClick={onRemove}
                type={ESectionType.step}
                key={`gr-step-remove-step-action`}
              />
            ),
          ].filter(Boolean)}
        />
      </StepActionsContainer>
    </StepCardHeader>
  )
}