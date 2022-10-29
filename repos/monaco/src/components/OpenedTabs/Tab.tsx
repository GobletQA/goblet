import type { CSSProperties } from 'react'
import type { TModal } from '../../types'

import { useEffect, useRef, useMemo } from 'react'
import { FileIcon } from '../icons/file'
import { preventDefault } from '../../utils/dom/preventDefault'
import { useTabCallbacks } from '../../hooks/tabs/useTabCallbacks'

export type TTabFile = {
  path: string
  status?: string
}

export type Tab = {
  Modal: TModal
  file: TTabFile
  currentPath?: string
  rootEl: HTMLElement | null
  onCloseFile: (key: string) => void
  onSaveFile: (path: string) => void
  onAbortSave: (path: string) => void
  onPathChange?: (key: string) => void
  onCloseOtherFiles: (path: string) => void
}

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
  status,
  active,
  hoverRight,
  closeVisible
}:THTabStyle) => {
  
  const edit:CSSProperties = useMemo(() => {
    return {
      visibility: status === 'editing' && !hoverRight ? 'visible' : 'hidden',
    }
  }, [
    status,
    hoverRight
  ])
  
  const close:CSSProperties = useMemo(() => {
    return {
      visibility: closeVisible ? 'visible' : 'hidden',
    }
  }, [closeVisible])

  const classNames = useMemo(() => {
    return [
      `goblet-monaco-editor-opened-tab-item`,
      active && `goblet-monaco-editor-opened-tab-item-focused`
    ].filter(Boolean).join(' ')
  }, [active])

  return {
    edit,
    close,
    classNames,
    ...tabStyles
  }
}

export const Tab = (props:Tab) => {
  const {
    file,
    currentPath,
  } = props

  const active = currentPath === file.path
  const name = file.path.split('/').slice(-1)[0]
  const itemRef = useRef<HTMLDivElement | null>(null)

  const {
    onTabClose,
    handleOver,
    hoverRight,
    handleLeave,
    onMouseDown,
    onPathChange,
    closeVisible,
  } = useTabCallbacks(props, active)

  useEffect(() => {
    active && itemRef.current?.scrollIntoView({ block: 'nearest' })
  }, [active])

  const styles = useTabStyle({
    active,
    hoverRight,
    closeVisible,
    status: file.status
  })

  return (
    <div
      ref={itemRef}
      data-src={file.path}
      onClick={onPathChange}
      onMouseOver={handleOver}
      onMouseDown={onMouseDown}
      onMouseLeave={handleLeave}
      className={styles.classNames}
      onContextMenu={preventDefault}
    >
      <FileIcon style={styles.icon} />
      <span style={styles.name}>{name}</span>
      <span
        data-name='editing'
        style={styles.edit}
        className='goblet-monaco-editor-opened-tab-item-editing'
      />
      <span
        data-name='editing'
        onClick={onTabClose}
        style={styles.close}
        className='goblet-monaco-editor-opened-tab-item-close'
      >
        x
      </span>
    </div>
  )
}
