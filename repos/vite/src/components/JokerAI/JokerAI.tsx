import type { TBottomDrawerRef } from '@components/BottomDrawer'
import { SyntheticEvent, useCallback, useRef, useState } from 'react'
import {
  BottomDrawer
} from '@components/BottomDrawer'
import {
  JokerAIContainer
} from './JokerAI.styled'
import {JokerTabs} from '@constants/nav'




export type TJokerAI = {
  
}

export const JokerAI = (props:TJokerAI) => {
  const drawerRef = useRef<TBottomDrawerRef>()


  const onToggle = () => {
    
  }

  const onLock = () => {
    
  }

  const onTabClick = () => {
    
  }

  const [active, setActive] = useState(0)

  const onTabChange = useCallback((event: SyntheticEvent, newValue: number) => {
    setActive(newValue)
  }, [])

  return (
    <JokerAIContainer  className='gb-joker-container' >
      <BottomDrawer
        onLock={onLock}
        tabs={JokerTabs}
        activeTab={active}
        onToggle={onToggle}
        drawerRef={drawerRef}
        onTabChange={onTabChange}
      >
      </BottomDrawer>
    </JokerAIContainer>
  )
}