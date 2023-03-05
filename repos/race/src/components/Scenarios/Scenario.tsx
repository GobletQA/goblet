import type { TScenarioAst, TStepAst } from '@ltipton/parkin'

import type { TScenarioParentAst } from '@GBR/types'

import { Steps } from '../Steps'
import { Section } from '../Section'
import { AddAct } from '../Actions/Add'
import { PlayAct } from '../Actions/Play'
import { ESectionType } from '@GBR/types'
import { CopyAct } from '../Actions/Copy'
import { DeleteAct } from '../Actions/Delete'
import { EmptySteps } from '../Steps/EmptySteps'
import { StepAddIcon } from '@gobletqa/components'
import { copyScenario } from '@GBR/actions/scenario/copyScenario'

export type TScenario = {
  scenario: TScenarioAst
  parent: TScenarioParentAst
  onAdd?: (...args:any[]) => void
  onRemove: (scenarioId:string, parentId?:string) => void
  onAddStep: (scenarioId:string, parentId?:string) => void
  onChangeStep: (step:TStepAst, scenarioId:string, parentId?:string) => void
  onRemoveStep: (stepId:string, scenarioId?:string, parentId?:string) => void
}

export const Scenario = (props:TScenario) => {
  const {
    parent,
    scenario,
    onRemove,
    onAddStep,
    onChangeStep,
    onRemoveStep,
  } = props

  const onCopyScenario = () => copyScenario(scenario)

  const onRemoveScenario = () => onRemove(scenario.uuid, parent.uuid)
  const onAddScenarioStep = () => onAddStep(scenario.uuid, parent.uuid)
  const onChangeScenarioStep = (step:TStepAst) => onChangeStep(step, scenario.uuid, parent.uuid)
  const onRemoveScenarioStep = (stepId:string) => onRemoveStep(stepId, scenario.uuid, parent.uuid)

  const onPlay = () => {}

  return (
    <Section
      parent={parent}
      initialExpand={true}
      show={Boolean(scenario)}
      type={ESectionType.scenario}
      id={`${parent.uuid}-scenario`}
      className='gr-scenario-section'
      actions={[
        (
          <AddAct
            Icon={StepAddIcon}
            onClick={onAddScenarioStep}
            type={ESectionType.step}
            key={`gr-scenario-add-step-action`}
          />
        ),
        (
          <PlayAct
            onClick={onPlay}
            type={ESectionType.background}
            key={`gr-background-play-action`}
          />
        ),
        (
          <CopyAct
            onClick={onCopyScenario}
            type={ESectionType.scenario}
            key={`gr-rule-copy-scenario-action`}
          />
        ),
        (
          <DeleteAct
            onClick={onRemoveScenario}
            type={ESectionType.scenario}
            key={`gr-scenario-remove-action`}
          />
        )
      ]}
    >
      <Steps
        showAdd={false}
        parent={scenario}
        onAdd={onAddScenarioStep}
        onChange={onChangeScenarioStep}
        onRemove={onRemoveScenarioStep}
      />
      <EmptySteps
        parent={scenario}
        onAdd={onAddScenarioStep}
      />
    </Section>
  )
}