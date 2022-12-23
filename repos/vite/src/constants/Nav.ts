import type { TSideNav } from '@types'

import { EEditorType, ESideNav } from '@types'
import { deepFreeze } from '@keg-hub/jsutils'
import {
  onFiles,
  onEditor,
  onSettings,
  onArtifacts,
  onEnvironments,
} from '@actions/nav'
import {
  Settings,
  DesignIcon,
  EditorSwitch,
  FileTreeIcon,
  InsertChartIcon,
  SettingsEthernetIcon,
} from '@components/Icons'


export const HeaderNav = [
  {
    label: `Profile`,
    Icon: `ProfileIcon`,
  },
  {
    label: `Settings`,
    Icon: `SettingsIcon`,
  },
  {
    label: `Team`,
    Icon: `TeamIcon`,
  },
  {
    label: `Unmount Repo`,
    Icon: `CloudOffIcon`,
  },
]

export const EditorNavItems = {
  [EEditorType.visual]: {
    title: `Visual Editor`,
    action: onEditor,
    Icon: DesignIcon,
    name: ESideNav.editor,
    tooltip: `Switch to Code Editor`,
  },
  [EEditorType.code]: {
    title: `Code Editor`,
    hidden: true,
    action: onEditor,
    Icon: DesignIcon,
    name: ESideNav.editor,
    tooltip: `Switch to Visual Editor`,
  },
}

export const SideNav = deepFreeze({
  groupClassName: `group-nav-list`,
  groups: [
    {
      name: `core-navigation`,
      items: [
        EditorNavItems[EEditorType.code],
        EditorNavItems[EEditorType.visual],
        {
          title: `Files`,
          action: onFiles,
          Icon: FileTreeIcon,
        },
        {
          Icon: InsertChartIcon,
          title: `Artifacts`,
          action: onArtifacts,
        },
        {
          title: `Envs`,
          action: onEnvironments,
          tooltip: `Environments`,
          Icon: SettingsEthernetIcon
        },
      ]
    },
    {
      name: `settings`,
      style: {
        bottom: 0,
        position: `absolute`,
      },
      items: [
        {
          Icon: Settings,
          title: `Settings`,
          action: onSettings
        }
      ]
    }
  ]
}) as TSideNav


export const DefinitionTabs = [
  {
    id: 0,
    key: 0,
    icon: `all`,
    name: `All Steps`,
  },
  {
    id: 1,
    key: 1,
    icon: `default`,
    name: `Default Steps`,
  },
  {
    id: 2,
    key: 2,
    icon: `custom`,
    name: `Custom Steps`,
  },
]