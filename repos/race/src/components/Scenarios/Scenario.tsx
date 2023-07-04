import type { MutableRefObject, CSSProperties } from 'react'
import type { TRaceScenarioParent, TRaceStep, TRaceScenario } from '@GBR/types'

import { Steps } from '../Steps'
import { EditTitle } from '../Title/EditTitle'
import { EmptySteps } from '../Steps/EmptySteps'
import { Section, SectionHeader } from '../Section'
import { ESectionType, EGherkinKeys } from '@GBR/types'
import { useEditSectionTitle } from '@GBR/hooks/useEditSectionTitle'
import { useSectionActions } from '@GBR/hooks/editor/useSectionActions'
import { useScenarioActions } from '@GBR/hooks/actions/useScenarioActions'

export type TScenario = {
  scenarioId: string
  scenario: TRaceScenario
  showDragHandle?:boolean
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
  } = props

  const {
    onMoveStep,
    onPasteStep,
    // onCopyScenario,
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

  const actions = useSectionActions({
    editingTitle,
    item: scenario,
    toggleEditTitle,
    // onCopy: onCopyScenario,
    onPaste: onPasteStep,
    onRemove: onRemoveScenario,
    onAddStep: onAddScenarioStep,
    type: ESectionType.scenario,
  })

  return (
    <Section
      id={scenarioId}
      parent={parent}
      actions={actions}
      sx={styles.section}
      formatHeader={false}
      show={Boolean(scenario)}
      type={ESectionType.scenario}
      dragHandleSx={dragHandleSx}
      dragHandleRef={dragHandleRef}
      showDragHandle={showDragHandle}
      className={`gb-scenario-section`}
      parentTypes={[ESectionType.feature, ESectionType.rule]}
      label={(
        <SectionHeader
          id={scenario.uuid}
          content={sectionTitle}
          type={ESectionType.scenario}
        />
      )}
    >
    
    {showTitle && (
      <EditTitle
        uuid={scenario.uuid}
        onBlur={onEditTitle}
        type={ESectionType.scenario}
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
      >
        {isNamed && (
          <EmptySteps
            parent={scenario}
            onAdd={onAddScenarioStep}
            parentType={ESectionType.scenario}
          />
        ) || null}
      </Steps>
    </Section>
  )
}