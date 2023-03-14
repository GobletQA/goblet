import type { TScenarioAst, TStepAst } from '@ltipton/parkin'

import type { TScenarioParentAst } from '@GBR/types'

import { Steps } from '../Steps'
import { AddAct } from '../Actions/Add'
import { PlayAct } from '../Actions/Play'
import { CopyAct } from '../Actions/Copy'
import { DeleteAct } from '../Actions/Delete'
import { EditTitle } from '../Title/EditTitle'
import { EmptySteps } from '../Steps/EmptySteps'
import { StepAddIcon } from '@gobletqa/components'
import { EditTitleAct } from '../Actions/EditTitle'
import { Section, SectionHeader } from '../Section'
import { ESectionType, EGherkinKeys } from '@GBR/types'
import { copyScenario } from '@GBR/actions/scenario/copyScenario'
import { useEditSectionTitle } from '@GBR/hooks/useEditSectionTitle'
import { updateScenario } from '@GBR/actions/scenario/updateScenario'
import { updateScenarioStepPos } from '@GBR/actions/scenario/updateScenarioStepPos'

export type TScenario = {
  scenarioId: string
  scenario: TScenarioAst
  parent: TScenarioParentAst
  onAdd?: (...args:any[]) => void
  onRemove: (scenarioId:string, parentId?:string) => void
  onAddStep: (scenarioId:string, parentId?:string) => void
  onChange:(scenarioId:string, update:Partial<TScenarioAst>) => void
  onChangeStep: (step:TStepAst, scenarioId:string, parentId?:string) => void
  onRemoveStep: (stepId:string, scenarioId?:string, parentId?:string) => void
}

const styles = {
  title: {
    marginTop:`10px`,
    marginBottom:`30px`,
    padding: `0px 10px`,
  }
}

export const Scenario = (props:TScenario) => {
  const {
    parent,
    scenario,
    onRemove,
    onChange,
    onAddStep,
    scenarioId,
    onChangeStep,
    onRemoveStep,
  } = props

  const {
    isNamed,
    showTitle,
    onEditTitle,
    sectionTitle,
    editingTitle,
    toggleEditTitle,
  } = useEditSectionTitle({
    title: scenario.scenario,
    key: EGherkinKeys.scenario,
    callback: (update?:string) => {
      scenario.scenario !== update && onChange(scenario.uuid, { scenario: update })
    },
  })


  const onPlay = () => {}

  const onCopyScenario = () => copyScenario(scenario)
  const onRemoveScenario = () => onRemove(scenario.uuid, parent.uuid)
  const onAddScenarioStep = () => onAddStep(scenario.uuid, parent.uuid)
  const onChangeScenarioStep = (step:TStepAst) => onChangeStep(step, scenario.uuid, parent.uuid)
  const onRemoveScenarioStep = (stepId:string) => onRemoveStep(stepId, scenario.uuid, parent.uuid)

  return (
    <Section
      id={scenarioId}
      parent={parent}
      formatHeader={false}
      show={Boolean(scenario)}
      type={ESectionType.scenario}
      className={`gb-scenario-section`}
      label={(
        <SectionHeader
          content={sectionTitle}
          type={ESectionType.scenario}
        />
      )}
      actions={[
        (
          <EditTitleAct
            label={`Description`}
            editing={editingTitle}
            onClick={toggleEditTitle}
            type={ESectionType.scenario}
            key={`gb-scenario-edit-title-action`}
          />
        ),
        (
          <AddAct
            Icon={StepAddIcon}
            onClick={onAddScenarioStep}
            type={ESectionType.step}
            key={`gb-scenario-add-step-action`}
          />
        ),
        (
          <DeleteAct
            onClick={onRemoveScenario}
            type={ESectionType.scenario}
            key={`gb-scenario-remove-action`}
          />
        ),
        (
          <CopyAct
            onClick={onCopyScenario}
            type={ESectionType.scenario}
            key={`gb-rule-copy-scenario-action`}
          />
        ),
        (
          <PlayAct
            onClick={onPlay}
            type={ESectionType.scenario}
            key={`gb-background-play-action`}
          />
        ),
      ]}
    >
    
    {showTitle && (
      <EditTitle
        sx={styles.title}
        uuid={scenario.uuid}
        onBlur={onEditTitle}
        type={ESectionType.scenario}
        label={`Description`}
        value={scenario.scenario.replace(`${EGherkinKeys.scenario}:`, ``)}
      />
    ) || null}

      <Steps
        showAdd={false}
        parent={scenario}
        onAdd={onAddScenarioStep}
        onMove={updateScenarioStepPos}
        onChange={onChangeScenarioStep}
        onRemove={onRemoveScenarioStep}
        parentType={ESectionType.scenario}
      />
      {isNamed && (
        <EmptySteps
          parent={scenario}
          onAdd={onAddScenarioStep}
          parentType={ESectionType.scenario}
        />
      ) || null}
    </Section>
  )
}