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
import { Dnd, useInline } from '@gobletqa/components'
import { useDropData } from '@GBR/hooks/editor/useDropData'
import { moveScenario } from '@GBR/actions/general/moveScenario'
import { updateScenarioPos } from '@GBR/actions/scenario/updateScenarioPos'

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
  const data = useDropData({
    ...props,
    gran: feature,
    parentType: parent.type,
  })

  const onDropScenario = useInline<TOnDrop<TDndItemData>>((
    oldIdx,
    newIdx,
    pos,
    oldData,
    newData
  ) => {
    oldData?.parent && newData?.parent && oldData?.parent !== newData?.parent
      ? moveScenario({ oldData, newData, pos })
      : updateScenarioPos({
          newIdx,
          oldIdx,
          parentId: parent.uuid,
          parentType: parent.type,
        })
  })

  return (
    <Sections
      onAdd={onAdd}
      showAdd={false}
      parent={parent}
      type={ESectionType.scenario}
    >
    {scenarios?.length
      ? scenarios?.map((scenario, idx) => {
          return (
            <DndScenario
              index={idx}
              parent={parent}
              feature={feature}
              key={scenario.uuid}
              onRemove={onRemove}
              scenario={scenario}
              onChange={onChange}
              showDragHandle={true}
              onAddStep={onAddStep}
              onDrop={onDropScenario}
              parentType={parent.type}
              scenarioId={scenario.uuid}
              onChangeStep={onChangeStep}
              onRemoveStep={onRemoveStep}
            />
          )
        })
      : (
          <Dnd
            index={0}
            data={data}
            dropOnly={true}
            onDrop={onDropScenario}
            parentTypes={[ESectionType.feature, ESectionType.rule]}
          />
        )
    }
    </Sections>
  )
}