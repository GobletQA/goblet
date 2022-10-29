import './OpenedTabs.css'
import type { TModal } from '../../types'

import { Tab } from './Tab'

export type OpenedTabs = {
  openedFiles: Array<{
    status?: string
    path: string
  }>
  Modal: TModal
  onPathChange?: (key: string) => void
  currentPath?: string
  onCloseFile: (path: string) => void
  rootEl: HTMLElement | null
  onSaveFile: (path: string) => void
  onAbortSave: (path: string) => void
  onCloseOtherFiles: (path: string) => void
}

export const OpenedTabs = ({
  Modal,
  rootEl,
  onSaveFile,
  openedFiles,
  onAbortSave,
  currentPath,
  onCloseFile,
  onPathChange,
  onCloseOtherFiles,
}:OpenedTabs) => {
  return (
    <div className='goblet-monaco-editor-opened-tab-wrapper'>
      <div className='goblet-monaco-editor-opened-tab'>
        {openedFiles.map(file => (
          <Tab
            file={file}
            Modal={Modal}
            key={file.path}
            rootEl={rootEl}
            onSaveFile={onSaveFile}
            onAbortSave={onAbortSave}
            onCloseFile={onCloseFile}
            currentPath={currentPath}
            onPathChange={onPathChange}
            onCloseOtherFiles={onCloseOtherFiles}
          />
        ))}
      </div>
    </div>
  )
}

