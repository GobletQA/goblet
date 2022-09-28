import './OpenedTabs.css'

import { Tab } from './Tab'

export type OpenedTabs = {
  openedFiles: Array<{
    status?: string
    path: string
  }>
  onPathChange?: (key: string) => void
  currentPath?: string
  onCloseFile: (path: string) => void
  rootEl: HTMLElement | null
  onSaveFile: (path: string) => void
  onAbortSave: (path: string) => void
  onCloseOtherFiles: (path: string) => void
}

export const OpenedTabs = ({
  openedFiles,
  onPathChange,
  currentPath,
  onCloseFile,
  rootEl,
  onSaveFile,
  onAbortSave,
  onCloseOtherFiles,
}:OpenedTabs) => {
  return (
    <div className='goblet-monaco-editor-opened-tab-wrapper'>
      <div className='goblet-monaco-editor-opened-tab'>
        {openedFiles.map(file => (
          <Tab
            onSaveFile={onSaveFile}
            onAbortSave={onAbortSave}
            rootEl={rootEl}
            onCloseFile={onCloseFile}
            file={file}
            key={file.path}
            onPathChange={onPathChange}
            currentPath={currentPath}
            onCloseOtherFiles={onCloseOtherFiles}
          />
        ))}
      </div>
    </div>
  )
}

