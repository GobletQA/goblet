import type { TTabStyles, TTab, TTabItem } from '../../types'

import { noOpObj } from '@keg-hub/jsutils'

import { Tooltip } from '@GBC/components/Tooltip'
import { CloseIcon } from '@GBC/components/Icons'
import { useLayoutEffect, useRef, useMemo } from 'react'
import {scrollToTab} from '@GBC/utils/components/scrollToTab'
import { useTabCallbacks } from '@GBC/hooks/tabs/useTabCallbacks'
import {
  OpenTab,
  OpenTabTitle,
  OpenTabClose,
  OpenTabEditing,
} from './OpenedTabs.styled'

const defStyles:TTabStyles = {
  icon: { marginRight: '2px' },
  title: {}
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

const useTitle = (props:TTabItem) => {
  const { tab } = props

  return useMemo(() => {
    const truncated = tab?.path
      ? `/${tab?.path?.split('/')?.slice(-1).join(`/`)}`
      : ``

    const title = tab?.title
    return !title || title.length > 30
      ? truncated || title
      : title
  }, [
    tab?.path,
    tab?.title
  ])
}

export const Tab = (props:TTabItem) => {
  const {
    tab,
    Icon,
    styles:tabStyles,
  } = props

  const title = useTitle(props)
  const itemRef = useRef<HTMLDivElement | null>(null)

  const {
    onTabDown,
    onTabClose,
    onTabHover,
    onTabClick,
    onTabLeave,
  } = useTabCallbacks(props)

  useLayoutEffect(() => {
    tab?.active
      && itemRef.current
      && scrollToTab({ target: itemRef.current })
  }, [tab?.active])

  const styles = useTabStyle(tab, tabStyles)

  return (
    <OpenTab
      ref={itemRef}
      onClick={onTabClick}
      onMouseDown={onTabDown}
      onMouseOver={onTabHover}
      onMouseLeave={onTabLeave}
      className={styles.classNames}
      data-src={tab?.uuid || tab?.path}
    >
      {Icon && (
        <Icon
          style={styles.icon}
          className='goblet-editor-opened-tab-item-icon'
        />
      )}
      <Tooltip
        wrap
        fontSize={`13px`}
        enterDelay={1000}
        title={tab?.path || tab.title || title}
      >
        <OpenTabTitle
          style={styles.title}
          className='goblet-editor-opened-tab-item-title'
        >
          {title}
        </OpenTabTitle>
      </Tooltip>
      <OpenTabEditing
        data-name='editing'
        className='goblet-editor-opened-tab-item-edit'
      />
      <OpenTabClose
        data-name='editing'
        onClick={onTabClose}
        className='goblet-editor-opened-tab-item-close'
      >
        <CloseIcon
          className='goblet-editor-opened-tab-close-icon'
        />
      </OpenTabClose>
    </OpenTab>
  )
}
