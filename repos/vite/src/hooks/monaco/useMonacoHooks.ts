import type { MutableRefObject } from 'react'
import type { TEditorRefHandle } from '@gobletqa/monaco'
import type {
  TMonaco,
  IEditor,
  TDefinitionAst,
  TOpenFileTreeEvent,
  TEditorSettingValues,
} from '@types'

import { useEventListen } from '../useEvent'
import { useMemo, useCallback } from 'react'
import { useDecorations } from './useDecorations'
import { useFiles, useRepo, useDefs } from '@store'
import { useMonacoConfig } from './useMonacoConfig'
import { exists, set, noOp } from '@keg-hub/jsutils'
import { confirmModal } from '@actions/modals/modals'
import { EE } from '@gobletqa/shared/libs/eventEmitter'
import { toggleModal } from '@actions/modals/toggleModal'
import { getRootPrefix } from '@utils/repo/getRootPrefix'
import { rmRootFromLoc } from '@utils/repo/rmRootFromLoc'
import { isCustomDef } from '@utils/definitions/isCustomDef'
import { useSettingValues } from '@hooks/store/useSettingValues'
import { loadGobletFile } from '@actions/files/api/loadGobletFile'
import {
  UpdateModalEvt,
  OpenFileTreeEvt,
  OpenEditorFileEvt,
} from '@constants'


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
  editorRef:MutableRefObject<TEditorRefHandle|null>
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

  useEventListen<TOpenFileTreeEvent>(OpenFileTreeEvt, ({ size }) => {
    exists(size) && editorRef?.current?.resizeSidebar?.(size)
  })

  useEventListen<TDefinitionAst>(OpenEditorFileEvt, async (defAst:TDefinitionAst) => {
    const { location } = defAst

    // If it's a custom file then it should already be loaded
    if(isCustomDef(location)){
      const relative = rmRootFromLoc(location, rootPrefix)
      editorRef?.current?.openFile?.(relative)
      return
    }

    // If it's a goblet file, then load it
    // And then make call to open it in the editor
    const loaded = await loadGobletFile(location)
    if(!loaded) return

    setTimeout(() => {
      const relative = rmRootFromLoc(loaded.location, rootPrefix)
      editorRef?.current?.openFile?.(relative, loaded.content)
    }, 50)

  })

  // TODO: remove this if it's not needed
  const onEditorLoaded = useCallback((editor:IEditor, monaco:TMonaco) => {}, [])

  useDecorations({ editorRef, repo, rootPrefix })

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
