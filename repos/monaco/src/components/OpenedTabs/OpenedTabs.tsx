import './OpenedTabs.css'
import type { TFileMeta, TModal, TAutoSave } from '../../types'

import { Tab } from './Tab'

export type OpenedTabs = {
  Modal: TModal
  autoSave:TAutoSave
  openedFiles: TFileMeta[]
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
  autoSave,
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
            autoSave={autoSave}
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

