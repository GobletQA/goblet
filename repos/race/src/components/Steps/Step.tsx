import type { MutableRefObject, CSSProperties } from 'react'
import type { TRaceGran, TRaceStep, TRaceStepParent } from '@GBR/types'

import { Section } from '../Section'
import { cls } from '@keg-hub/jsutils'
import { StepHeader } from './StepHeader'
import { Expressions } from '../Expressions'
import { SelectAction } from './SelectAction'
import { NoExpMatch } from '../Expressions/NoExpMatch'
import { useExpressions } from '@GBR/hooks/steps/useExpressions'
import { useMatchStepToDef } from '@GBR/hooks/steps/useMatchStepToDef'
import { useSectionActions } from '@GBR/hooks/editor/useSectionActions'
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
  showDragHandle?:boolean
  dragHandleSx?: CSSProperties
  dragHandleRef?: MutableRefObject<HTMLDivElement>
  onRemove?:(stepId:string, parentId:string) => void
  onChange?:(updated:TRaceStep, parentId:string) => void
}

const styles = {
  section: {
    marginTop: `0px`
  },
  content: {
    boxShadow: `none`,
    backgroundColor: `var(--goblet-editor-background);`
  },
}

export const Step = (props:TStep) => {
  const {
    gran,
    parent,
    onChange,
    onRemove,
    dragHandleSx,
    dragHandleRef,
    showDragHandle,
  } = props

  const { step, definition } = useMatchStepToDef(props)
  const { def, expressions } = useExpressions(props, { definition })

  const onPlay = () => {}
  const onCopy = () => {}
  const onStepChange = (updated:TRaceStep) => onChange?.(updated, parent.uuid)
  const onRemoveStep = () => onRemove?.(step.uuid, parent.uuid)
  const onCollapseExcept = () => collapseAllExcept(step.uuid, parent?.uuid, gran?.uuid)

  const actions = useSectionActions({
    onPlay,
    onCopy,
    onRemove: onRemoveStep,
    type: ESectionType.step,
    onCollapse: onCollapseExcept,
  })

  return (
    <StepContainer
      raised={false}
      variant="outlined"
      className={cls(`gb-step-container`)}
    >
      <Section
        show={true}
        id={step.uuid}
        parent={parent}
        noToggle={false}
        actions={actions}
        sx={styles.section}
        formatHeader={false}
        type={ESectionType.step}
        contentSx={styles.content}
        dragHandleSx={dragHandleSx}
        dragHandleRef={dragHandleRef}
        className={`gb-step-section`}
        showDragHandle={showDragHandle}
        parentTypes={[ESectionType.scenario, ESectionType.background]}
        label={(
          <StepHeader
            def={def}
            step={step}
            expressions={expressions}
          />
        )}
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