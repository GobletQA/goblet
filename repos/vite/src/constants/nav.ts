import type { ReactNode, CSSProperties } from 'react'
import { deepFreeze } from '@keg-hub/jsutils'

export type TNavItem = {
  title: string,
  icon?: string | ReactNode
  style?: CSSProperties
  [key:string]: any
}

export type TNavGroup = {
  name: string
  style?: CSSProperties
  items: TNavItem[]
  [key:string]: any
}

export type TSideNav = {
  groupClassName?: string
  groups: TNavGroup[]
}

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
          title: `Reports`,
          icon: `RuleCheck`
        },
        {
          title: `Artifacts`,
          icon: `Picture`
        },
        {
          title: `Waypoint`,
          icon: `MapPoint`
        },
        {
          title: `World`,
          icon: `Globe`
        },
        {
          title: `Steps`,
          icon: `Steps`,
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
          title: `Settings`,
          icon: `Settings`
        }
      ]
    }
  ]
}) as TSideNav