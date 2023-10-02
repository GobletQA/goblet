
import type { MutableRefObject, SyntheticEvent } from 'react'
import type { TBottomDrawerTab } from '@gobletqa/components'

import {
  JokerTabs,
  JokerQATab,
  JokerFeatureTab,
} from '@constants/nav'
import { JokerQandA } from './JokerQandA'
import { JokerFeature } from './JokerFeature'

import { JokerAIContainer } from './JokerAI.styled'
import { useCallback, useMemo, useState } from 'react'
import {
  colors,
  LockIcon,
  BottomDrawer,
  LockOpenIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from '@gobletqa/components'
import { exists } from '@keg-hub/jsutils'


export type TJokerAI = {
  parentRef?:MutableRefObject<HTMLElement|undefined>
}

const styles = {
  lock: {
    closed: { color: colors.cardinal, fontSize: `16px` },
    open: { color: colors.shinyShamrock, fontSize: `16px` },
  },
  toggle: {
    fontSize: `22px`
  },
  paper: {
    zIndex: `20`,
    width: `100%`,
    position: `absolute`,
  }
}

const TabMap = {
  JokerQATab: JokerQandA,
  JokerFeatureTab: JokerFeature
}

const useJokerTabs = () => {
  const [open, setOpen] = useState(false)
  const [locked, setLocked] = useState(false)

  const toggleDrawer = useCallback((state?:boolean, fromClickAway?:boolean) => {
    if(locked && fromClickAway) return
    const update = exists<boolean>(state) ? state : !open
    setOpen(update)
  }, [open, locked])

  const toggleLock = useCallback((state?:boolean) => {
    const update = exists<boolean>(state) ? state : !locked
    setLocked(update)
  }, [locked])
  
  
  const tabs = useMemo(() => {
    return [
      ...JokerTabs,
      {
        action: true,
        showText: false,
        OnIcon: LockIcon,
        id: `lock-drawer`,
        key: `lock-drawer`,
        name: `Drawer Locked`,
        actionActive: locked,
        OffIcon: LockOpenIcon,
        onAction: () => toggleLock(!locked),
        iconProps: {
          sx: styles.lock
        },
      },
      {
        action: true,
        showText: false,
        actionActive: open,
        id: `toggle-drawer`,
        key: `toggle-drawer`,
        name: `Drawer Toggle`,
        OffIcon: ChevronUpIcon,
        OnIcon:  ChevronDownIcon,
        onAction: () => toggleDrawer(!open),
        iconProps: {
          sx: styles.toggle
        },
      }
    ] as TBottomDrawerTab[]
  }, [
    open,
    locked,
    toggleLock,
    toggleDrawer
  ])
  
  
  return {
    tabs,
    open,
    locked,
    toggleLock,
    toggleDrawer
  }
}

export const JokerAI = (props:TJokerAI) => {

  const [active, setActive] = useState(0)

  const {
    tabs,
    open,
    toggleDrawer
  } = useJokerTabs()

  const onTabClick = useCallback((event: SyntheticEvent, newValue?:number) => {
    newValue !== active && setActive(newValue || 0)
    !open && toggleDrawer(true)
  }, [open, active])

  const Component = TabMap[tabs[active]?.id as keyof typeof TabMap] || JokerFeature

  return (
    <JokerAIContainer  className='gb-joker-container' >
      <BottomDrawer
        open={open}
        tabs={tabs}
        activeTab={active}
        onToggle={toggleDrawer}
        onTabClick={onTabClick}
      >
        <Component />
      </BottomDrawer>
    </JokerAIContainer>
  )
}