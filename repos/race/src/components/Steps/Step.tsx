import type { MutableRefObject } from 'react'
import type { TStepAst } from '@ltipton/parkin'
import type { TStepParentAst } from '@GBR/types'

import { Section } from '../Section'
import { StepHeader } from './StepHeader'
import { Expressions } from '../Expressions'
import { SelectAction } from './SelectAction'
import { NoExpMatch } from '../Expressions/NoExpMatch'
import { colors, useInline } from '@gobletqa/components'
import { usePropId } from '@GBR/hooks/features/usePropId'
import { useExpressions } from '@GBR/hooks/useExpressions'
import { useMatchStepToDef } from '@GBR/hooks/steps/useMatchStepToDef'
import {
  StepGrid,
  StepContent,
  StepContainer,
} from './Steps.styled'
import { ESectionType } from '@GBR/types'
import { PlayAct } from '../Actions/Play'
import { CopyAct } from '../Actions/Copy'
import { DeleteAct } from '../Actions/Delete'

export type TStep = {
  step: TStepAst
  parent: TStepParentAst
  dragHandleRef?: MutableRefObject<HTMLDivElement>
  onRemove?:(stepId:string, parentId?:string) => void
  onChange?:(updated:TStepAst, old?:TStepAst) => void
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
    parent,
    onChange,
    onRemove,
    dragHandleRef,
  } = props
  const { step, definition } = useMatchStepToDef(props)
  const { def, expressions } = useExpressions(props, { definition })

  const onCopy = useInline(() => {})
  const onStepChange = useInline((updated:TStepAst) => onChange?.(updated, step))
  const onRemoveStep = useInline(() => onRemove?.(step.uuid, parent.uuid))

  const sectionId = usePropId(parent, step, ESectionType.step)

  return (
    <StepContainer
      raised={false}
      variant="outlined"
      className='gb-step-container'
    >
      <Section
        show={true}
        id={sectionId}
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
            ) || step.step && (<NoExpMatch />)}
          </StepGrid>
        </StepContent>
      </Section>
    </StepContainer>
  )
}