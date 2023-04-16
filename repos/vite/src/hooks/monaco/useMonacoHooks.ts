import type { MutableRefObject } from 'react'
import type { TEditorRefHandle } from '@gobletqa/monaco'
import type {
  TFileTree,
  TDefinitionAst,
  TSideNavToggleProps,
  TEditorSettingValues,
} from '@types'

import { useMemo } from 'react'
import { ESideNav } from '@types'
import { useFiles, useRepo } from '@store'
import { useDecorations } from './useDecorations'
import { useMonacoConfig } from './useMonacoConfig'
import { confirmModal } from '@actions/modals/modals'
import { EE } from '@gobletqa/shared/libs/eventEmitter'
import { toggleModal } from '@actions/modals/toggleModal'
import { exists, set, emptyObj } from '@keg-hub/jsutils'
import { getRootPrefix } from '@utils/repo/getRootPrefix'
import { rmRootFromLoc } from '@utils/repo/rmRootFromLoc'
import { isCustomDef } from '@utils/definitions/isCustomDef'
import { useSettingValues } from '@hooks/settings/useSettingValues'
import { loadGobletFile } from '@actions/files/api/loadGobletFile'
import {
  useEventEmit,
  useOnEvent,
} from '@gobletqa/components'

import {
  UpdateModalEvt,
  ToggleSideNavEvt,
  OpenEditorFileEvt,
} from '@constants'

import {
  useOnAddFile,
  useOnLoadFile,
  useOnSaveFile,
  useEditorFiles,
  useOnRenameFile,
  useOnDeleteFile,
  useOnPathChange,
} from '../files'


const emptyFileTree = emptyObj as TFileTree

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
  const files = repoFiles?.files || emptyFileTree 

  const rootPrefix = useMemo(
    () => getRootPrefix(repo),
    [repo?.paths?.repoRoot, repo?.paths?.workDir]
  )

  const editorFiles = useEditorFiles({
    repo,
    repoFiles,
    rootPrefix,
  })

  const onPathChange = useOnPathChange()
  const onLoadFile = useOnLoadFile(files, rootPrefix)
  const onSaveFile = useOnSaveFile(files, rootPrefix)
  const onDeleteFile = useOnDeleteFile(files, rootPrefix)
  const onAddFile = useOnAddFile(files, rootPrefix, repo)
  const onRenameFile = useOnRenameFile(files, rootPrefix)
  const onBeforeAddFile = useEventEmit<TSideNavToggleProps>(
    ToggleSideNavEvt,
    { open: true, name: ESideNav.Files }
  )

  const config = useMonacoConfig()
  const { theme, ...options } = useSettingValues<TEditorSettingValues>(`editor`)

  exists(theme) && set(config, `theme.name`, theme)

  useOnEvent<TDefinitionAst>(OpenEditorFileEvt, async (defAst:TDefinitionAst) => {
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

  useDecorations({ editorRef, repo, rootPrefix })

  return {
    config,
    options,
    rootPrefix,
    onAddFile,
    onSaveFile,
    onLoadFile,
    onRenameFile,
    onDeleteFile,
    modalActions,
    onPathChange,
    onBeforeAddFile,
    ...editorFiles,
  }
}
