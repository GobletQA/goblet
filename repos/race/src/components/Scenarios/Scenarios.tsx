import type {
  TRaceStep,
  TDndItemData,
  TRaceScenario,
  TRaceScenarioParent,
} from '@GBR/types'
import type { TOnDrop } from '@gobletqa/components'

import { Sections } from '../Section'
import { ESectionType } from '@GBR/types'
import { useEditor } from '@GBR/contexts'
import { DndScenario } from './DndScenario'
import { useInline } from '@gobletqa/components'


export type TScenarios = {
  scenarios?:TRaceScenario[]
  parent:TRaceScenarioParent
  onAdd: (parentId?:string) => void
  onRemove: (scenarioId:string, parentId?:string) => void
  onAddStep: (scenarioId:string, parentId?:string) => void
  onChange :(scenarioId:string, update:Partial<TRaceScenario>) => void
  onChangeStep: (step:TRaceStep, scenarioId:string, parentId?:string) => void
  onRemoveStep: (stepId:string, scenarioId?:string, parentId?:string) => void
}

export const Scenarios = (props:TScenarios) => {

  const {
    parent,
    onAdd,
    onChange,
    onRemove,
    onAddStep,
    scenarios,
    onChangeStep,
    onRemoveStep
  } = props

  const { feature } = useEditor()
  const onDropScenario = useInline<TOnDrop<TDndItemData>>((
    oldIdx,
    newIdx,
    pos,
    oldData,
    data
  ) => {
    // TODO: add scenario dnd logic here
  })

  const showDragHandle = Boolean((scenarios?.length || 0) > 1)

  return (
    <Sections
      onAdd={onAdd}
      showAdd={false}
      parent={parent}
      type={ESectionType.scenario}
    >
    {
      scenarios?.map((scenario, idx) => {
        return (
          <DndScenario
            index={idx}
            parent={parent}
            feature={feature}
            key={scenario.uuid}
            onRemove={onRemove}
            scenario={scenario}
            onChange={onChange}
            onAddStep={onAddStep}
            onDrop={onDropScenario}
            parentType={parent.type}
            scenarioId={scenario.uuid}
            onChangeStep={onChangeStep}
            onRemoveStep={onRemoveStep}
            showDragHandle={showDragHandle}
          />
        )
      })
    }
    </Sections>
  )
}