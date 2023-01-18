import type { MutableRefObject } from 'react'

import type { TEditorTheme } from './editor.types'
import type { Modal } from '../components/Modal/Modal'
import type { TFolder, TFileItem, TFilelist } from './file.types'
import type { TEditorAction as TEAction } from '@gobletqa/components'
import type { TCodeEditor, TFileCallback, TCodeEditorRef } from './helpers.types'

export type TModal = Modal

export type TEditorAction = TEAction<TCodeEditor, TCodeEditorRef>

export interface IMultiRefType {
  getAllValue: () => TFilelist
  getValue: (path: string) => string | null
  getSupportThemes: () => Array<string>
  setTheme: (name: string, theme?:TEditorTheme) => void
}

export type TFileProps = {
  file: TFileItem
  parent: TFolder
  Modal: TModal
  root: boolean
  rootPrefix?:string
  currentPath?: string
  onAddFile: TFileCallback
  onAddFolder: TFileCallback
  abortAddFile:TFileCallback
  onDeleteFile: TFileCallback
  abortAddFolder:TFileCallback
  onEditFileName: TFileCallback
  onDeleteFolder: TFileCallback
  onEditFolderName: TFileCallback
  onConfirmAddFile: TFileCallback
  onConfirmAddFolder: TFileCallback
  onPathChange: (key: string) => void
  filesRef: MutableRefObject<TFilelist>
}

