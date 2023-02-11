import type { TStepParentAst, TStepAst } from '@GBR/types'

import { Section } from '../Section'
import { StepHeader } from './StepHeader'
import { Expressions } from '../Expressions'
import { SelectAction } from './SelectAction'
import { useInline } from '@gobletqa/components'
import { NoExpMatch } from '../Expressions/NoExpMatch'
import { useExpressions } from '@GBR/hooks/useExpressions'
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
  onRemove?:(stepId:string, parentId?:string) => void
  onChange?:(updated:TStepAst, old?:TStepAst) => void
}

const styles = {
  section: {
    marginTop: `0px`
  },
  action: {}
}

export const Step = (props:TStep) => {
  const { onChange, onRemove, step, parent } = props
  const { def, expressions } = useExpressions(props)

  const onCopy = useInline(() => {})
  const onStepChange = useInline((updated:TStepAst) => onChange?.(updated, step))
  const onRemoveStep = useInline(() => onRemove?.(step.uuid, parent.uuid))

  return (
    <StepContainer variant="outlined">
      <Section
        show={true}
        parent={parent}
        noToggle={false}
        sx={styles.section}
        formatHeader={false}
        initialExpand={true}
        type={ESectionType.step}
        className={`gr-step-section`}
        label={(<StepHeader step={step} />)}
        id={`gr-${parent.uuid}-step-${step.uuid}`}
        actions={[
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
              onClick={onRemoveStep}
              type={ESectionType.step}
              key={`gr-step-remove-step-action`}
            />
          ),
        ].filter(Boolean)}
      >
        <StepContent>
          <StepGrid
            container
            spacing={1}
            width='100%'
            disableEqualOverflow
          >
            <SelectAction
              step={step}
              parent={parent}
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