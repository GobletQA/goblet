import type { MouseEventHandler } from 'react'
import type { TModal } from '../../types'

import { FileIcon } from '../icons/file'

import { useTabCallbacks } from '../../hooks/tabs/useTabCallbacks'
import { useCallback, useEffect, useRef } from 'react'

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

export const Tab = (props:Tab) => {
  const {
    file,
    currentPath,
  } = props

  const itemRef = useRef<HTMLDivElement | null>(null)
  const name = file.path.split('/').slice(-1)[0]
  const active = currentPath === file.path

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

  return (
    <div
      ref={itemRef}
      data-src={file.path}
      onMouseOver={handleOver}
      onMouseDown={onMouseDown}
      onMouseLeave={handleLeave}
      onContextMenu={e => e.preventDefault()}
      className={`goblet-monaco-editor-opened-tab-item ${
        active ? 'goblet-monaco-editor-opened-tab-item-focused' : ''
      }`}
      onClick={onPathChange}
    >
      <FileIcon style={{ marginRight: '2px' }} />
      <span style={{ flex: 1, paddingRight: '5px' }}>{name}</span>
      <span
        data-name='editing'
        className='goblet-monaco-editor-opened-tab-item-editing'
        style={{
          visibility: file.status === 'editing' && !hoverRight ? 'visible' : 'hidden',
        }}
      />
      <span
        data-name='editing'
        onClick={onTabClose}
        style={{
          visibility: closeVisible ? 'visible' : 'hidden',
        }}
        className='goblet-monaco-editor-opened-tab-item-close'
      >
        x
      </span>
    </div>
  )
}
