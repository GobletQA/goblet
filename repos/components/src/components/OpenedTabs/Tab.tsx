import type { TTabStyles, TTab, TTabItem } from '../../types'

import { noOpObj } from '@keg-hub/jsutils'
import { useEffect, useRef, useMemo } from 'react'
import { preventDefault } from '../../utils/dom/preventDefault'
import { useTabCallbacks } from '../../hooks/tabs/useTabCallbacks'
import {
  OpenTab,
  OpenTabName,
  OpenTabClose,
  OpenTabEditing,
} from './OpenedTabs.styled'


const defStyles:TTabStyles = {
  icon: { marginRight: '2px' },
  title: { flex: 1, paddingRight: '5px' }
}

const useTabStyle = (
  { editing, active }:TTab,
  tabStyles:TTabStyles=noOpObj as TTabStyles
) => {

  const classNames = useMemo(() => {
    return [
      `goblet-editor-opened-tab-item`,
      active && `focused`,
      editing && `editing`
    ].filter(Boolean).join(' ')
  }, [active, editing])

  const styles = useMemo(() => ({
    icon: { ...defStyles.icon, ...tabStyles?.icon },
    title: { ...defStyles.title, ...tabStyles?.title }
  }), [
    tabStyles?.icon,
    tabStyles?.title,
  ])

  return {
    classNames,
    ...styles
  }
}

export const Tab = (props:TTabItem) => {
  const {
    tab,
    Icon,
    active,
    styles:tabStyles,
  } = props

  const title = (tab?.title || tab?.path?.split('/')?.slice(-1)[0]) as string
  const itemRef = useRef<HTMLDivElement | null>(null)

  const {
    onTabDown,
    onTabClose,
    onTabHover,
    onTabClick,
    onTabLeave,
  } = useTabCallbacks(props)

  useEffect(() => {
    active && itemRef.current?.scrollIntoView({ block: 'nearest' })
  }, [active])

  const styles = useTabStyle(tab, tabStyles)

  return (
    <OpenTab
      ref={itemRef}
      onClick={onTabClick}
      onMouseDown={onTabDown}
      onMouseOver={onTabHover}
      onMouseLeave={onTabLeave}
      className={styles.classNames}
      onContextMenu={preventDefault}
      data-src={tab?.uuid || tab?.path}
    >
      {Icon && (<Icon style={styles.icon} />)}
      <OpenTabName style={styles.title}>{title}</OpenTabName>
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
