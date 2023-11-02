import type { TSideNav } from '@types'

import { EEditorType, ESideNav } from '@types'
import { deepFreeze } from '@keg-hub/jsutils'
import {
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
  LogoutIcon,
  FileTreeIcon,
  SettingsIcon,
  CloudOffIcon,
  FunctionsIcon,
  LabelImportantIcon,
  FolderPlayOutlineIcon,
} from '@gobletqa/components'
import { settingsModal } from '@actions/modals'
import { disconnectRepo } from '@actions/repo/api/disconnect'
import { signOutManually } from '@actions/admin/user/signOutManually'
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
    onClick: () => settingsModal()
  },
  // {
  //   label: `Team`,
  //   Icon: TeamIcon,
  // },
  {
    label: `Unmount Repo`,
    Icon: CloudOffIcon,
    onClick: () => disconnectRepo()
  },
  {
    divider: true,
    label: `Sign Out`,
    Icon: LogoutIcon,
    onClick: signOutManually,
  }
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