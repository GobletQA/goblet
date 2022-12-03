import type { MutableRefObject } from 'react'
import type {
  TMonaco,
  OpenFileTreeEvent,
  TEditorSettingValues
} from '@types'

import { useEffect, useMemo, useCallback } from 'react'
import { useFiles, useRepo } from '@store'
import { exists, set } from '@keg-hub/jsutils'
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

const defs:any[] = []


export const useMonacoHooks = (
  editorRef:MutableRefObject<any>
) => {

  const repo = useRepo()
  const repoFiles = useFiles()

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
  
  
  const gherkinSyntaxCb = useGherkinSyntax(defs)
  const onMonacoLoaded = useCallback((monaco:TMonaco) => gherkinSyntaxCb(monaco), [gherkinSyntaxCb])

  return {
    config,
    options,
    rootPrefix,
    onLoadFile,
    modalActions,
    onMonacoLoaded,
    onAddFile,
    onSaveFile,
    onRenameFile,
    onDeleteFile,
    ...editorFiles,
  }
}
