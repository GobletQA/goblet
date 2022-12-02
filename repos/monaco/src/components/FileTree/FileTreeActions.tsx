import type { TPanelHeaderAction } from '../Sidebar/PanelHeader'

import { noOp } from '@keg-hub/jsutils'
import AddFileIcon from '../Icons/AddFile'
import AddFolderIcon from '../Icons/AddFolder'

export const FileTreeActions:TPanelHeaderAction[] = [
  {
    action:noOp,
    id:`add-root-file`,
    Component: AddFileIcon,
    className:`'goblet-monaco-editor-list-split-icon'`,
  },
  {
    action:noOp,
    id: `add-root-folder`,
    Component: AddFolderIcon,
    className:`'goblet-monaco-editor-list-split-icon'`,
  }
]
