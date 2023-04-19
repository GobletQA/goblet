import type { TSectionAction } from '@GBR/components/Section/SectionActions'
import { useMemo } from 'react'
import { exists, capitalize } from '@keg-hub/jsutils'
import { ESectionType, EGherkinKeys } from '@GBR/types'
import {
  TrashIcon,
  StepAddIcon,
  CardPlusIcon,
  PencilAddIcon,
  PencilMinusIcon,
  ContentCopyIcon,
  CollapseAllIcon,
  PlaylistPlusIcon,
  PlayCircleOutlineIcon
} from '@gobletqa/components'

type TAnyCB = (...args:any[]) => void

export type THSectionActions = {
  onPlay?:TAnyCB
  onCopy?:TAnyCB
  onRemove?:TAnyCB
  onAddStep?:TAnyCB
  onCollapse?:TAnyCB
  onAddScenario?:TAnyCB
  onAddBackground?:TAnyCB
  editingTitle?:boolean
  type:ESectionType|EGherkinKeys
  toggleEditTitle?:(val?: boolean | undefined) => void
}

export const useSectionActions = (props:THSectionActions) => {
  const {
    type,
    onCopy,
    onPlay,
    onRemove,
    onAddStep,
    onCollapse,
    onAddScenario,
    onAddBackground,
    editingTitle,
    toggleEditTitle
  } = props


  const actions = useMemo(() => {
    const typeCaps = capitalize(type)
    const actions:TSectionAction[] = []

    exists(onPlay)
      && actions.push({
          type,
          onClick: onPlay,
          dividerBottom: true,
          label: `Play ${typeCaps}`,
          Icon: PlayCircleOutlineIcon,
          key: `gb-${type}-play-action`,
        })

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
    onPlay,
    onRemove,
    onAddStep,
    onCollapse,
    onAddScenario,
    onAddBackground,
  ])

  return useMemo(() => {
    return exists(editingTitle) && exists(toggleEditTitle)
      ? actions.concat([{
          type,
          dividerTop: true,
          label: `Edit Description`,
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