import type { TRaceFiles } from '@types'
import type { TRaceFeatureGroup, TRaceFeature } from '@gobletqa/race'

import { useMemo } from 'react'
import { useRepo } from '@store'
import {exists} from '@keg-hub/jsutils'
import { useInline } from '@gobletqa/components'
import { EmptyFeatureUUID } from '@gobletqa/race'
import { useRaceSettings } from '@hooks/race/useRaceSettings'
import { useRaceStepDefs } from '@hooks/race/useRaceStepDefs'
import { useRaceFeatures } from '@hooks/race/useRaceFeatures'
import { useOnWorldChange } from '@hooks/race/useOnWorldChange'
import { useMultiFeatsErr } from '@hooks/race/useMultiFeatsErr'
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

export const useRaceHooks = () => {

  const repo = useRepo()
  const rootPrefix = useMemo(() => getFeaturePrefix(repo), [repo?.paths])

  const definitions = useRaceStepDefs()
  const files = useFeatureFiles(rootPrefix)
  const onSaveFile = useOnSaveFile(files, rootPrefix)
  const onAddFile = useOnAddFile(files, rootPrefix, repo)
  const onRenameFile = useOnRenameFile(files, rootPrefix)
  const onDeleteFeature = useOnDeleteFile(files, rootPrefix)
  const { features, duplicates } = useRaceFeatures(files as TRaceFiles)

  const {
    settings,
    onSettingChange,
  } = useRaceSettings()

  const onPathChange = useOnPathChange()

  const onFeatureRename = useInline(async (
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
  })

  const onFeatureActive = useInline(async (feature:TRaceFeature) => {
    const { location } = await getActiveFeature()
    const activeFeat = files[location]
    if(activeFeat?.location === feature?.parent?.uuid) return

    feature?.parent?.uuid
      ? onPathChange(feature.parent.uuid)
      : console.warn(`Can not set feature active, missing file path`, feature)
  })

  const onFeatureClose = useInline(async (feature:TRaceFeature) => {
    const { location } = await getActiveFeature()
    const activeFeat = files[location]

    // This happens when an empty feature is closed before it's saved with a valid name
    if(!activeFeat) return

    ;(activeFeat?.uuid === EmptyFeatureUUID || activeFeat?.uuid === feature?.parent?.uuid)
      && onPathChange(``)
  })

  const onFeatureChange = useInline((feature:TRaceFeature) => {
    if(!feature?.parent?.uuid)
      return console.warn(`Failed to save feature, feature is missing the parent file path`)
    
    const fileModel = files[feature?.parent?.uuid]
    if(!fileModel) return console.warn(`Failed to save feature, can not find the file in the feature store`)

    const { parent, path, ...featureAst } = feature

    // TODO: update this to be an object, instead of multi params
    onSaveFile(
      parent.uuid,
      feature.content,
      { ast:[featureAst] }
    )
  })

  const onFeatureCreate = useInline(async (feature:TRaceFeature|TRaceFeatureGroup) => {
    if(!feature?.parent?.location)
      return console.warn(`Failed to create feature, feature is missing the parent file path`)

    if(feature.type === `folder`)
      return await onAddFile({
        isFolder: true,
        location: feature?.parent?.location,
      })

    const { parent, path, content, ...featureAst } = feature

    await onAddFile({ content, location: parent.uuid })
  })

  const onFeatureDelete = useInline(async (feature:TRaceFeature|TRaceFeatureGroup) => {
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
  })

  const onWorldChange = useOnWorldChange({
    repo,
    rootPrefix,
    onSaveFile,
  })

  useMultiFeatsErr({ duplicates })

  return {
    settings,
    features,
    rootPrefix,
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