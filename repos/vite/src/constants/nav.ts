import type { TSideNav } from '@types'

import { deepFreeze } from '@keg-hub/jsutils'
import {
  onFiles,
  onSettings,
  onArtifacts,
  onEnvironments,
} from '@actions/nav'


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

export const SideNav = deepFreeze({
  groupClassName: `group-nav-list`,
  groups: [
    {
      name: `core-navigation`,
      items: [
        {
          title: `Files`,
          action: onFiles,
          icon: `FileTreeIcon`,
        },
        {
          icon: `Picture`,
          title: `Artifacts`,
          action: onArtifacts,
        },
        {
          title: `Envs`,
          action: onEnvironments,
          tooltip: `Environments`,
          icon: `SettingsEthernetIcon`
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
          icon: `Settings`,
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