import type { MutableRefObject, CSSProperties } from 'react'
import type {
  TRaceStep,
  TRaceGran,
  TRaceStepParent,
} from '@GBR/types'

import { Section } from '../Section'
import { cls } from '@keg-hub/jsutils'
import { StepHeader } from './StepHeader'
import { ESectionType } from '@GBR/types'
import { Expressions } from '../Expressions'
import { SelectAction } from './SelectAction'
import { NoExpMatch } from '../Expressions/NoExpMatch'
import { useStepAudit } from '@GBR/hooks/steps/useStepAudit'
import { useSectionActions } from '@GBR/hooks/editor/useSectionActions'
import { collapseAllExcept } from '@GBR/actions/general/collapseAllExcept'
import {
  StepGrid,
  StepContent,
  StepContainer,
} from './Steps.styled'


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
    marginTop: `0px`,
  },
  content: {
    boxShadow: `none`,
    backgroundColor: `var(--goblet-editorGroup-background);`
  },
  headerText: {
    height: `auto`
  },
  actions: {
    alignItems: `start`,
  }
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

  const {
    def,
    step,
    expressions
  } = useStepAudit(props)

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

  const hasDef = def && expressions
  const missingDef = Boolean(!hasDef && step.step.trim())

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
        actionsSx={styles.actions}
        contentSx={styles.content}
        dragHandleSx={dragHandleSx}
        dragHandleRef={dragHandleRef}
        className={`gb-step-section`}
        showDragHandle={showDragHandle}
        headerTextSx={styles.headerText}
        parentTypes={[ESectionType.scenario, ESectionType.background]}
        label={(
          <StepHeader
            step={step}
            missingDef={missingDef}
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
          
            {missingDef && (<NoExpMatch />)}
          
            <SelectAction
              def={def}
              step={step}
              parent={parent}
              onChange={onStepChange}
            />
            {hasDef && (
              <Expressions
                def={def}
                step={step}
                parent={parent}
                onChange={onStepChange}
                expressions={expressions}
              />
            ) || null}
          </StepGrid>
        </StepContent>
      </Section>
    </StepContainer>
  )
}