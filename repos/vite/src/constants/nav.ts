import type { TSideNav } from '@types'

import { EEditorType, ESideNav } from '@types'
import { deepFreeze } from '@keg-hub/jsutils'
import {
  onJokerAsk,
  onSettings,
  onArtifacts,
  onEnvironments,
} from '@actions/nav'

import {
  setEditor
} from '@actions/app'
import {
  AppsIcon,
  Settings,
  DesignIcon,
  FileTreeIcon,
  SettingsIcon,
  CloudOffIcon,
  FunctionsIcon,
  JokerIcon,
  QuestionAnswerIcon,
  LabelImportantIcon,
  FolderPlayOutlineIcon,
} from '@gobletqa/components'


import { toggleTestRunsView } from '@actions/testRuns/toggleTestRunsView'

export const SubNavId = `gb-nav-subnav-for-portal`

export const HeaderNav = [
  // {
  //   label: `Profile`,
  //   Icon: ProfileIcon,
  // },
  {
    label: `Settings`,
    Icon: SettingsIcon,
  },
  // {
  //   label: `Team`,
  //   Icon: TeamIcon,
  // },
  {
    label: `Unmount Repo`,
    Icon: CloudOffIcon,
  },
]

export const EditorNavItems = {
  [EEditorType.visual]: {
    title: `No-Code Editor`,
    action: setEditor,
    Icon: DesignIcon,
    name: ESideNav.editor,
    tooltip: `Switch to Low-Code Editor`,
  },
  [EEditorType.code]: {
    title: `Code Editor`,
    hidden: true,
    action: setEditor,
    Icon: DesignIcon,
    name: ESideNav.editor,
    tooltip: `Switch to No-Code Editor`,
  },
}

export const SideNav = deepFreeze({
  groupClassName: `group-nav-list`,
  groups: [
    {
      name: `core-navigation`,
      items: [
        {
          title: `Files`,
          Icon: FileTreeIcon,
        },
        {
          Icon: JokerIcon,
          title: `Ask Joker A.I.`,
          action: onJokerAsk,
        },
        // {
        //   Icon: InsertChartIcon,
        //   title: `Artifacts`,
        //   action: onArtifacts,
        // },
        // {
        //   title: `Envs`,
        //   action: onEnvironments,
        //   tooltip: `Environments`,
        //   Icon: SettingsEthernetIcon
        // },
      ].filter(Boolean)
    },
    {
      name: `settings`,
      style: {
        bottom: 0,
        position: `absolute`,
      },
      items: [
        {
          title: `Run Test Suite`,
          Icon: FolderPlayOutlineIcon,
          action: () => toggleTestRunsView(),
        },
        EditorNavItems[EEditorType.code],
        EditorNavItems[EEditorType.visual],
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
    Icon: AppsIcon,
    name: `All Steps`,
  },
  {
    id: 1,
    key: 1,
    name: `Default Steps`,
    Icon: LabelImportantIcon,
  },
  {
    id: 2,
    key: 2,
    Icon: FunctionsIcon,
    name: `Custom Steps`,
  },
]

export const JokerQATab = `JokerQATab`
export const JokerActionsTab = `JokerActionsTab`


export const JokerTabs = [
  {
    id: JokerActionsTab,
    key: JokerActionsTab,
    Icon: JokerIcon,
    name: `Joker`,
  },
  {
    name: `Q&A`,
    id: JokerQATab,
    key: JokerQATab,
    Icon: QuestionAnswerIcon,
  }
]
