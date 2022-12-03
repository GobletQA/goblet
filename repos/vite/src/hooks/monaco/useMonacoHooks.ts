import type { MutableRefObject } from 'react'
import type {
  TMonaco,
  IEditor,
  OpenFileTreeEvent,
  TEditorSettingValues,
} from '@types'

import { useEffect, useMemo, useCallback } from 'react'
import { useFiles, useRepo, useDefs } from '@store'
import { exists, set, noOp } from '@keg-hub/jsutils'
import { useMonacoConfig } from './useMonacoConfig'
import { confirmModal } from '@actions/modals/modals'
import { useGherkinSyntax } from './useGherkinSyntax'
import { EE } from '@gobletqa/shared/libs/eventEmitter'
import { toggleModal } from '@actions/modals/toggleModal'
import { getRootPrefix } from '@utils/repo/getRootPrefix'
import { OpenFileTreeEvt, UpdateModalEvt } from '@constants'
import { useSettingValues } from '@hooks/store/useSettingValues'

import {
  useOnAddFile,
  useOnLoadFile,
  useOnSaveFile,
  useEditorFiles,
  useOnRenameFile,
  useOnDeleteFile,
} from './useFileHooks'

const modalActions = {
  close: () => toggleModal(false),
  open: (props?:Record<any, any>) => {
    EE.emit(UpdateModalEvt, props)
    confirmModal({ visible: true})
  },
}


export const useMonacoHooks = (
  editorRef:MutableRefObject<any>
) => {

  const repo = useRepo()
  const repoFiles = useFiles()
  const defs = useDefs()

  const rootPrefix = useMemo(
    () => getRootPrefix(repo),
    [repo?.paths?.repoRoot, repo?.paths?.workDir]
  )

  const editorFiles = useEditorFiles({
    repo,
    repoFiles,
    rootPrefix,
  })

  const onLoadFile = useOnLoadFile({
    repo,
    repoFiles,
    rootPrefix,
    ...editorFiles
  })

  const onDeleteFile = useOnDeleteFile(repoFiles, rootPrefix)
  const onAddFile = useOnAddFile(repoFiles, rootPrefix, repo)
  const onSaveFile = useOnSaveFile(repoFiles, rootPrefix)
  const onRenameFile = useOnRenameFile(repoFiles, rootPrefix)

  const config = useMonacoConfig()
  const { theme, ...options } = useSettingValues<TEditorSettingValues>(`editor`)

  exists(theme) && set(config, `theme.name`, theme)

  useEffect(() => {
    EE.on<OpenFileTreeEvent>(OpenFileTreeEvt, ({ size }) => {
      exists(size) && editorRef?.current?.resizeFileTree?.(size)
    }, `${OpenFileTreeEvt}-code-editor`)

    return () => {
      EE.off<OpenFileTreeEvent>(OpenFileTreeEvt, `${OpenFileTreeEvt}-code-editor`)
    }
  }, [])
  
  
  const addGherkinSyntax = useGherkinSyntax(defs.definitionTypes)
  const onEditorLoaded = useCallback(
    (editor:IEditor, monaco:TMonaco) => addGherkinSyntax(editor, monaco),
    [addGherkinSyntax]
  )

  return {
    config,
    options,
    rootPrefix,
    onLoadFile,
    modalActions,
    onEditorLoaded,
    onMonacoLoaded:noOp,
    onAddFile,
    onSaveFile,
    onRenameFile,
    onDeleteFile,
    ...editorFiles,
  }
}
