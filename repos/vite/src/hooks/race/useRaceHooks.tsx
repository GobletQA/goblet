import type { TRaceFiles } from '@types'
import type {
  TEditorRef,
  TRaceDecoRef,
  TRaceDecoCtx,
  TRaceFeature,
  TRaceFeatureGroup,
} from '@gobletqa/race'

import { useRepo } from '@store'
import {exists} from '@keg-hub/jsutils'

import { EmptyFeatureUUID } from '@gobletqa/race'
import { useMemo, useRef, useCallback } from 'react'
import { useEffectOnce } from '@gobletqa/components'
import { useRaceSettings } from '@hooks/race/useRaceSettings'
import { useRaceStepDefs } from '@hooks/race/useRaceStepDefs'
import { useRaceFeatures } from '@hooks/race/useRaceFeatures'
import { useOnWorldChange } from '@hooks/race/useOnWorldChange'
import { useMultiFeatsErr } from '@hooks/race/useMultiFeatsErr'
import { useRaceLastOpened } from '@hooks/race/useRaceLastOpened'
import { useRaceDecorations } from '@hooks/race/useRaceDecorations'
import { getFeaturePrefix } from '@utils/features/getFeaturePrefix'
import { getActiveFeature } from '@utils/features/getActiveFeature'

import {
  useOnAddFile,
  useOnSaveFile,
  useFeatureFiles,
  useOnRenameFile,
  useOnDeleteFile,
  useOnPathChange,
} from '@hooks/files'

export const useRaceHooks = (editorRef:TEditorRef) => {

  const repo = useRepo()
  const decoRef = useRef<TRaceDecoCtx>() as TRaceDecoRef
  const rootPrefix = useMemo(() => getFeaturePrefix(repo), [repo?.paths])

  const definitions = useRaceStepDefs()
  const files = useFeatureFiles(rootPrefix)
  const onSaveFile = useOnSaveFile(files, rootPrefix)
  const lastOpened = useRaceLastOpened(rootPrefix, files)
  const onAddFile = useOnAddFile(files, rootPrefix, repo)
  const onRenameFile = useOnRenameFile(files, rootPrefix)
  const onDeleteFeature = useOnDeleteFile(files, rootPrefix)
  const { features, duplicates } = useRaceFeatures(files as TRaceFiles)

  const {
    settings,
    onSettingChange,
  } = useRaceSettings()

  const onPathChange = useOnPathChange()

  const onFeatureRename = useCallback(async (
    feature:TRaceFeature|TRaceFeatureGroup,
    oldLoc:string,
    content?:string
  ) => {
    if(!feature?.parent?.location)
      return console.warn(`Failed to rename item, The new item location is required`)

    if(!oldLoc)
      return console.warn(`Failed to rename item, The original item location is required`)

    onRenameFile(
      oldLoc,
      feature?.parent?.location,
      exists(content) ? content : undefined
    )
  }, [onRenameFile])

  const onFeatureActive = useCallback(async (feature:TRaceFeature) => {
    const storage = feature?.parent?.uuid !== EmptyFeatureUUID

    feature?.parent?.uuid
      ? onPathChange(feature.parent.uuid, { storage })
      : onPathChange(``, { sidebar: false })
  }, [onPathChange])

  const onFeatureClose = useCallback(async (feature:TRaceFeature) => {
    const { location } = await getActiveFeature()
    const activeFeat = files[location]

    // This happens when an empty feature is closed before it's saved with a valid name
    if(!activeFeat) return

    ;(activeFeat?.uuid === EmptyFeatureUUID || activeFeat?.uuid === feature?.parent?.uuid)
      && onPathChange(``, { oldLoc: location })
  }, [files, onPathChange])

  const onFeatureChange = useCallback((feature:TRaceFeature) => {
    if(!feature?.parent?.uuid)
      return console.warn(`Failed to save feature, feature is missing the parent file path`)
    
    const fileModel = files[feature?.parent?.uuid]
    if(!fileModel) return console.warn(`Failed to save feature, can not find the file in the feature store`)

    const { parent, path, ...featureAst } = feature

    // Keeping as multiple params because thats how monaco lib expects it to be
    // Need to update monaco to convert the arguments to a single object
    onSaveFile(
      parent.uuid,
      feature.content,
      { ast:[featureAst] }
    )
  }, [files, onSaveFile])

  const onFeatureCreate = useCallback(async (feature:TRaceFeature|TRaceFeatureGroup) => {
    if(!feature?.parent?.location)
      return console.warn(`Failed to create feature, feature is missing the parent file path`)

    if(feature.type === `folder`)
      return await onAddFile({
        isFolder: true,
        location: feature?.parent?.location,
      })

    const { parent, path, content, ...featureAst } = feature

    await onAddFile({ content, location: parent.uuid })
  }, [files, onAddFile])

  const onFeatureDelete = useCallback(async (feature:TRaceFeature|TRaceFeatureGroup) => {
    if(!feature?.parent?.location)
      return console.warn(`Failed to delete feature, missing feature file location`)

    const loc = feature.parent.location

    if(feature.type === `folder`)
      return await onDeleteFeature(loc)


    const featFile = files[loc]
    if(!featFile)
      return console.warn(`Failed to delete feature, Feature file does not exist?`)

    // Assume only 1 feature per file
    await onDeleteFeature(loc)
  }, [files, onDeleteFeature])

  const onWorldChange = useOnWorldChange({
    repo,
    rootPrefix,
    onSaveFile,
  })

  useMultiFeatsErr({ duplicates })
  useRaceDecorations({
    repo,
    files,
    decoRef,
    editorRef,
    rootPrefix
  })

  useEffectOnce(() => {
    return () => {
      editorRef.current?.resetParkin?.()
    }
  })

  return {
    decoRef,
    settings,
    features,
    rootPrefix,
    lastOpened,
    definitions,
    onWorldChange,
    onFeatureClose,
    onSettingChange,
    onFeatureActive,
    onFeatureChange,
    onFeatureDelete,
    onFeatureCreate,
    onFeatureRename,
    world: repo.world,
    onFeatureSave: onFeatureChange,
    connected: Boolean(repo?.paths && repo?.name)
  }
}
