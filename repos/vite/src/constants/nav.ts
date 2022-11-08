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
          icon: `FileTree`
        },
        {
          title: `Steps`,
          icon: `Steps`,
        },
        {
          title: `Waypoint`,
          icon: `MapPoint`
        },
        {
          title: `Unit`,
          icon: `RuleCheck`
        },
        {
          title: `Artifacts`,
          icon: `Picture`
        },
        {
          title: `World`,
          icon: `Globe`
        },
        {
          title: `Env`,
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