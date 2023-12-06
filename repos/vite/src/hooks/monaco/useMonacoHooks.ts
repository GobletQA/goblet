import type { MutableRefObject } from 'react'
import type { TStepDef } from '@ltipton/parkin'
import type { TEditorRefHandle } from '@gobletqa/monaco'
import type {
  TFileTree,
  TSideNavToggleProps,
  TMonacoSettingValues,
} from '@types'

import { ESideNav } from '@types'
import { useFiles, useRepo } from '@store'
import { useMemo, useCallback } from 'react'
import { EE } from '@services/sharedService'
import { useEventEmit } from '@gobletqa/components'
import { confirmModal } from '@actions/modals/modals'
import { addRootToLoc } from '@utils/repo/addRootToLoc'
import { toggleModal } from '@actions/modals/toggleModal'
import { exists, set, emptyObj } from '@keg-hub/jsutils'
import { getRootPrefix } from '@utils/repo/getRootPrefix'
import { useDecorations } from '@hooks/monaco/useDecorations'
import { useMonacoConfig } from '@hooks/monaco/useMonacoConfig'
import { useOpenMonacoFile } from '@hooks/monaco/useOpenMonacoFile'
import { useSettingValues } from '@hooks/settings/useSettingValues'
import { useMonacoLastOpened } from '@hooks/monaco/useMonacoLastOpened'

import {
  UpdateModalEvt,
  ToggleSideNavEvt,
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
    () => getRootPrefix(repo) || ``,
    [repo?.paths?.repoRoot, repo?.paths?.workDir]
  )

  const lastOpened = useMonacoLastOpened(rootPrefix, files)
  const editorFiles = useEditorFiles({
    repo,
    repoFiles,
    rootPrefix,
  })

  const onPathChangeCB = useOnPathChange()
  const onPathChange = useCallback(
    (loc:string, content?:string|null, opts?:{ oldLoc?:string }) => {
      return onPathChangeCB(loc, {
        ...opts,
        fullLoc: loc && addRootToLoc(loc, rootPrefix),
        oldLoc: opts?.oldLoc && addRootToLoc(opts?.oldLoc, rootPrefix),
      })
    },
    [onPathChangeCB]
  )

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
  const { theme, ...options } = useSettingValues<TMonacoSettingValues>(`monaco`)

  exists(theme) && set(config, `theme.name`, theme)

  useOpenMonacoFile({ editorRef, rootPrefix, })
  useDecorations({ editorRef, repo, rootPrefix })

  return {
    config,
    options,
    rootPrefix,
    onAddFile,
    onSaveFile,
    onLoadFile,
    lastOpened,
    onRenameFile,
    onDeleteFile,
    modalActions,
    onPathChange,
    onBeforeAddFile,
    ...editorFiles,
  }
}
