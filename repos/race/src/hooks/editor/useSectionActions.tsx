import type { MouseEvent } from 'react'
import type { TSectionAction } from '@GBR/components/Section/SectionActions'
import type {
  TAnyCB,
  TRaceMenuItem,
  TRaceSectionItem,
  TCustomMenuAction,
  TRaceStep,
} from '@GBR/types'

import { useMemo } from 'react'
import { ESectionType, EGherkinKeys } from '@GBR/types'
import { useOperations } from '@gobletqa/race/contexts'
import { exists, capitalize, emptyArr } from '@keg-hub/jsutils'
import {useEditor} from '@gobletqa/race/contexts/EditorContext'
import {
  PasteIcon,
  TrashIcon,
  StepAddIcon,
  CardPlusIcon,
  PencilAddIcon,
  PencilMinusIcon,
  ContentCopyIcon,
  CollapseAllIcon,
  PlaylistPlusIcon,
} from '@gobletqa/components'

export type THSectionActions = {
  onCopy?:TAnyCB
  onRemove?:TAnyCB
  onPaste?:TAnyCB
  onAddStep?:TAnyCB
  onCollapse?:TAnyCB
  onAddScenario?:TAnyCB
  onAddBackground?:TAnyCB
  item:TRaceSectionItem
  editingTitle?:boolean
  type:ESectionType|EGherkinKeys
  toggleEditTitle?:(val?: boolean | undefined) => void
}

const useTypeMenuActions = (props:THSectionActions):TCustomMenuAction<any>[] => {

  const {
    item,
    type
  } = props

  const {
    feature,
    stepActions,
    ruleActions,
    featureActions,
    scenarioActions,
    backgroundActions,
  } = useEditor()

  return useMemo(() => {
    let actions = emptyArr as TCustomMenuAction<any>[]
    switch(type){
      case ESectionType.step: {
        if(stepActions) actions = stepActions
      }
      case ESectionType.scenario: {
        if(scenarioActions) actions = scenarioActions
      }
      case ESectionType.background: {
        if(backgroundActions) actions = backgroundActions
      }
      case ESectionType.rule: {
        if(ruleActions) actions = ruleActions
      }
      case ESectionType.feature: {
        if(featureActions) actions = featureActions
      }
    }

    return actions.map(action => {
      
      return {
        ...action,
        onClick: (evt:MouseEvent) => action.onClick(evt, {
          item,
          feature,
        })
      }
    })

  }, [
    item,
    type,
    feature,
    stepActions,
    ruleActions,
    featureActions,
    scenarioActions,
    backgroundActions,
  ])
}

export const useSectionActions = (props:THSectionActions) => {
  const {
    type,
    onCopy,
    onPaste,
    onRemove,
    onAddStep,
    onCollapse,
    editingTitle,
    onAddScenario,
    onAddBackground,
    toggleEditTitle
  } = props

  const { operations } = useOperations()
  const menuActions = useTypeMenuActions(props)

  const actions = useMemo(() => {
    const typeCaps = capitalize(type)
    const actions:TSectionAction[] = [...menuActions as TSectionAction[]]

    exists(onAddStep)
      && actions.push({
          label: `Add Step`,
          Icon: StepAddIcon,
          onClick: onAddStep,
          type: ESectionType.step,
          key: `gb-${type}-add-step-action`,
        })

    exists(onAddScenario)
      && actions.push({
          label: `Add Scenario`,
          onClick: onAddScenario,
          Icon: PlaylistPlusIcon,
          type: ESectionType.scenario,
          key: `gb-${type}-add-scenario-action`,
        })

    exists(onAddBackground)
      && actions.push({
          Icon: CardPlusIcon,
          label: `Add Background`,
          onClick: onAddBackground,
          type: ESectionType.background,
          key: `gb-${type}-add-background-action`,
        })

    exists(onCopy)
      && actions.push({
          type,
          onClick: onCopy,
          Icon: ContentCopyIcon,
          label: `Copy ${typeCaps}`,
          key: `gb-${type}-copy-action`,
        })

    const pasteType = (operations?.paste as TRaceStep)?.step
      ? `Step`
      : capitalize(operations?.paste?.type || `Item`)

    exists(onPaste)
      && actions.push({
          type,
          Icon: PasteIcon,
          onClick: onPaste,
          label: `Paste ${pasteType}`,
          key: `gb-${type}-copy-${pasteType}-action`,
        })

    exists(onCollapse)
      && actions.push({
          type,
          onClick: onCollapse,
          Icon: CollapseAllIcon,
          label: `Collapse Sections`,
          key: `gb-${type}-collapse-action`,
        })

    exists(onRemove)
      && actions.push({
          type,
          Icon: TrashIcon,
          onClick: onRemove,
          label: `Delete ${typeCaps}`,
          key: `gb-${type}-remove-action`,
        })

      return actions
  }, [
    type,
    onCopy,
    onPaste,
    onRemove,
    onAddStep,
    onCollapse,
    operations,
    menuActions,
    onAddScenario,
    onAddBackground,
    operations.paste
  ])

  return useMemo(() => {
    return exists(editingTitle) && exists(toggleEditTitle)
      ? actions.concat([{
          type,
          dividerTop: true,
          label: `Edit Title`,
          onClick: toggleEditTitle,
          key: `gb-${type}-edit-title-action`,
          Icon: editingTitle ? PencilMinusIcon : PencilAddIcon
        }] as TSectionAction[])
      : actions
  }, [
    type,
    actions,
    editingTitle,
    toggleEditTitle,
  ])

}