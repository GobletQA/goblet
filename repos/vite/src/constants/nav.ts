import type { TSideNav } from '@types'
import { deepFreeze } from '@keg-hub/jsutils'

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
          tooltip: ``,
          icon: `FileTree`
        },
        {
          title: `Steps`,
          tooltip: ``,
          icon: `Steps`,
        },
        {
          title: `Waypoint`,
          tooltip: ``,
          icon: `MapPoint`
        },
        {
          title: `Unit`,
          tooltip: ``,
          icon: `RuleCheck`
        },
        {
          title: `Artifacts`,
          tooltip: ``,
          icon: `Picture`
        },
        {
          title: `World`,
          tooltip: ``,
          icon: `Globe`
        },
        {
          title: `Env`,
          tooltip: ``,
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
        }
      ]
    }
  ]
}) as TSideNav