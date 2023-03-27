import type { MutableRefObject } from 'react'
import type { TRaceGran, TRaceStep, TRaceStepParent } from '@GBR/types'

import { Section } from '../Section'
import { StepHeader } from './StepHeader'
import { Expressions } from '../Expressions'
import { colors } from '@gobletqa/components'
import { SelectAction } from './SelectAction'
import { NoExpMatch } from '../Expressions/NoExpMatch'
import { useExpressions } from '@GBR/hooks/useExpressions'
import { useMatchStepToDef } from '@GBR/hooks/steps/useMatchStepToDef'
import { collapseAllExcept } from '@GBR/actions/general/collapseAllExcept'
import {
  StepGrid,
  StepContent,
  StepContainer,
} from './Steps.styled'
import { ESectionType } from '@GBR/types'
import { PlayAct } from '../Actions/Play'
import { CopyAct } from '../Actions/Copy'
import { DeleteAct } from '../Actions/Delete'
import { CollapseAct } from '../Actions/Collapse'

export type TStep = {
  step: TRaceStep
  gran: TRaceGran
  parent: TRaceStepParent
  dragHandleRef?: MutableRefObject<HTMLDivElement>
  onRemove?:(stepId:string, parentId?:string) => void
  onChange?:(updated:TRaceStep, old?:TRaceStep) => void
}

const styles = {
  section: {
    marginTop: `0px`
  },
  header: {
  },
  dragHandle: {
    color: colors.gray08,
    [`&:hover`]: {
      color: colors.purple10,
    }
  },
  action: {}
}

export const Step = (props:TStep) => {
  const {
    gran,
    parent,
    onChange,
    onRemove,
    dragHandleRef,
  } = props
  const { step, definition } = useMatchStepToDef(props)
  const { def, expressions } = useExpressions(props, { definition })

  const onCopy = () => {}
  const onStepChange = (updated:TRaceStep) => onChange?.(updated, step)
  const onRemoveStep = () => onRemove?.(step.uuid, parent.uuid)
  const onCollapseExcept = () => collapseAllExcept(step.uuid, parent?.uuid, gran?.uuid)

  return (
    <StepContainer
      raised={false}
      variant="outlined"
      className='gb-step-container'
    >
      <Section
        show={true}
        id={step.uuid}
        parent={parent}
        noToggle={false}
        sx={styles.section}
        formatHeader={false}
        headerSx={styles.header}
        type={ESectionType.step}
        dragHandleRef={dragHandleRef}
        className={`gb-step-section`}
        dragHandleSx={styles.dragHandle}
        label={(<StepHeader step={step} />)}
        actions={[
          (
            <DeleteAct
              sx={styles.action}
              onClick={onRemoveStep}
              type={ESectionType.step}
              key={`gb-step-remove-step-action`}
            />
          ),
          (
            <CollapseAct
              sx={styles.action}
              type={ESectionType.step}
              onClick={onCollapseExcept}
              key={`gb-step-collapse-step-action`}
            />
          ),
          (
            <CopyAct
              sx={styles.action}
              onClick={() => {}}
              type={ESectionType.step}
              key={`gb-step-copy-step-action`}
            />
          ),
          (
            <PlayAct
              sx={styles.action}
              onClick={() => {}}
              type={ESectionType.step}
              key={`gb-step-play-step-action`}
            />
          ),
        ].filter(Boolean)}
      >
        <StepContent className='gb-step-content' >
          <StepGrid
            container
            spacing={1}
            width='100%'
            disableEqualOverflow
          >
            <SelectAction
              step={step}
              parent={parent}
              definition={definition}
              onChange={onStepChange}
            />
            {def && (
              <Expressions
                def={def}
                step={step}
                parent={parent}
                onChange={onStepChange}
                expressions={expressions}
              />
            ) || step.step.trim() && (<NoExpMatch />)}
          </StepGrid>
        </StepContent>
      </Section>
    </StepContainer>
  )
}