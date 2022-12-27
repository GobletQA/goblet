import type { TTab, TTabItem } from '../../types'

import { useEffect, useRef, useMemo } from 'react'
import { preventDefault } from '../../utils/dom/preventDefault'
import { useTabCallbacks } from '../../hooks/tabs/useTabCallbacks'
import {
  OpenTab,
  OpenTabName,
  OpenTabClose,
  OpenTabEditing,
} from './OpenedTabs.styled'


export type THTabStyle = {
  active: boolean
  hoverRight:boolean
  closeVisible:boolean
  status:string | undefined
}

const tabStyles = {
  icon: { marginRight: '2px' },
  name: { flex: 1, paddingRight: '5px' }
}

const useTabStyle = ({
  editing,
  active,
}:TTab) => {

  const classNames = useMemo(() => {
    return [
      `goblet-editor-opened-tab-item`,
      active && `focused`,
      editing && `editing`
    ].filter(Boolean).join(' ')
  }, [active, editing])

  return {
    classNames,
    ...tabStyles
  }
}

export const Tab = (props:TTabItem) => {
  const {
    tab,
    Icon,
    activeTab
  } = props

  const active = tab?.active || (tab?.key || tab?.id) === activeTab
  const name = (tab?.title || tab?.name || tab?.path?.split('/')?.slice(-1)[0]) as string
  const itemRef = useRef<HTMLDivElement | null>(null)

  const {
    onTabDown,
    onTabClose,
    onTabHover,
    onTabClick,
    onTabLeave,
  } = useTabCallbacks(props, {
    name,
    active,
  })

  useEffect(() => {
    active && itemRef.current?.scrollIntoView({ block: 'nearest' })
  }, [active])

  const styles = useTabStyle(tab)

  return (
    <OpenTab
      ref={itemRef}
      onClick={onTabClick}
      onMouseDown={onTabDown}
      onMouseOver={onTabHover}
      onMouseLeave={onTabLeave}
      className={styles.classNames}
      onContextMenu={preventDefault}
      data-src={tab?.path || tab?.key || tab?.id}
    >
      {Icon && (<Icon style={styles.icon} />)}
      <OpenTabName style={styles.name}>{name}</OpenTabName>
      <OpenTabEditing
        data-name='editing'
        className='goblet-editor-opened-tab-item-edit'
      />
      <OpenTabClose
        data-name='editing'
        onClick={onTabClose}
        className='goblet-editor-opened-tab-item-close'
      >
        ×
      </OpenTabClose>
    </OpenTab>
  )
}
