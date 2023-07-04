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
import { useEditor } from '@gobletqa/race/contexts/EditorContext'

import {
  CutIcon,
  PasteIcon,
  TrashIcon,
  StepAddIcon,
  CardPlusIcon,
  PencilAddIcon,
  PasteAfterIcon,
  PasteBeforeIcon,
  PencilMinusIcon,
  ContentCopyIcon,
  CollapseAllIcon,
  PlaylistPlusIcon,
} from '@gobletqa/components'

export type THSectionActions = {
  onCut?:TAnyCB
  onCopy?:TAnyCB
  onRemove?:TAnyCB
  onPaste?:TAnyCB
  onAddStep?:TAnyCB
  onCollapse?:TAnyCB
  onPasteAfter?:TAnyCB
  onPasteBefore?:TAnyCB
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
    onCut,
    onCopy,
    onPaste,
    onRemove,
    onAddStep,
    onCollapse,
    onPasteAfter,
    onPasteBefore,
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

    exists(onCut)
      && actions.push({
          type,
          onClick: onCut,
          Icon: CutIcon,
          label: `Cut ${typeCaps}`,
          key: `gb-${type}-cut-action`,
        })

    exists(onCollapse)
      && actions.push({
          type,
          onClick: onCollapse,
          Icon: CollapseAllIcon,
          label: `Collapse Sections`,
          key: `gb-${type}-collapse-action`,
        })

    const pasteType = (operations?.paste?.item as TRaceStep)?.step
      ? `Step`
      : capitalize(operations?.paste?.item?.type || `Item`)

    exists(onPasteBefore)
      && actions.push({
          type,
          dividerTop: true,
          onClick: onPasteBefore,
          Icon: PasteBeforeIcon,
          label: `Paste Before ${pasteType}`,
          key: `gb-${type}-copy-${pasteType}-before-action`,
        })

    exists(onPaste)
      && actions.push({
          type,
          Icon: PasteIcon,
          onClick: onPaste,
          label: `Paste ${pasteType}`,
          key: `gb-${type}-copy-${pasteType}-action`,
        })

    exists(onPasteAfter)
      && actions.push({
          type,
          onClick: onPasteAfter,
          Icon: PasteAfterIcon,
          label: `Paste After ${pasteType}`,
          key: `gb-${type}-copy-${pasteType}-after-action`,
        })

    exists(onRemove)
      && actions.push({
          type,
          Icon: TrashIcon,
          dividerTop: true,
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
    onPasteAfter,
    onPasteBefore,
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