import type { MutableRefObject, CSSProperties } from 'react'
import type { TRaceScenarioParent, TRaceStep, TRaceScenario } from '@GBR/types'

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
import { useEditSectionTitle } from '@GBR/hooks/useEditSectionTitle'
import { useScenarioActions } from '@GBR/hooks/actions/useScenarioActions'

export type TScenario = {
  scenarioId: string
  scenario: TRaceScenario
  showDragHandle?:boolean
  dragTooltipOpen?:boolean
  parent: TRaceScenarioParent
  dragHandleSx?: CSSProperties
  onAdd?: (...args:any[]) => void
  dragHandleRef?: MutableRefObject<HTMLDivElement>
  onRemove: (scenarioId:string, parentId?:string) => void
  onAddStep: (scenarioId:string, parentId?:string) => void
  onChange:(scenarioId:string, update:Partial<TRaceScenario>) => void
  onChangeStep: (step:TRaceStep, scenarioId:string, parentId?:string) => void
  onRemoveStep: (stepId:string, scenarioId?:string, parentId?:string) => void
}

const styles = {
  section: {
    marginTop: `0px`,
  },
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
    onChange,
    scenarioId,
    dragHandleSx,
    dragHandleRef,
    showDragHandle,
    dragTooltipOpen,
  } = props

  const {
    onPlay,
    onMoveStep,
    onCopyScenario,
    onRemoveScenario,
    onAddScenarioStep,
    onChangeScenarioStep,
    onRemoveScenarioStep,
  } = useScenarioActions(props)

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

  return (
    <Section
      id={scenarioId}
      parent={parent}
      sx={styles.section}
      formatHeader={false}
      show={Boolean(scenario)}
      type={ESectionType.scenario}
      dragHandleSx={dragHandleSx}
      dragHandleRef={dragHandleRef}
      showDragHandle={showDragHandle}
      dragTooltipOpen={dragTooltipOpen}
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
        gran={parent}
        showAdd={false}
        parent={scenario}
        onMove={onMoveStep}
        onAdd={onAddScenarioStep}
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