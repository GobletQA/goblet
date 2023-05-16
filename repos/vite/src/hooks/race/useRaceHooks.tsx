import type { TRaceFeature } from '@gobletqa/race'

import { useMemo } from 'react'
import { useRepo } from '@store'
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
  useOnLoadFile,
  useOnSaveFile,
  useFeatureFiles,
  useOnRenameFile,
  useOnDeleteFile,
  useOnPathChange,
} from '@hooks/files'


export const useRaceHooks = () => {

  const repo = useRepo()
  const files = useFeatureFiles()
  const definitions = useRaceStepDefs()

  const { features, duplicates } = useRaceFeatures(files)
  const rootPrefix = useMemo(() => getFeaturePrefix(repo), [repo?.paths])

  const onSaveFile = useOnSaveFile(files, rootPrefix)
  const onAddFile = useOnAddFile(files, rootPrefix, repo)
  const onDeleteFeature = useOnDeleteFile(files, rootPrefix)

  // const onLoadFile = useOnLoadFile(files, rootPrefix)
  // const onRenameFile = useOnRenameFile(files, rootPrefix)

  const {
    settings,
    onSettingChange,
  } = useRaceSettings()

  const onPathChange = useOnPathChange()

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

  const onFeatureCreate = useInline((feature:TRaceFeature) => {
    if(!feature?.parent?.uuid)
      return console.warn(`Failed to create feature, feature is missing the parent file path`)

    const { parent, path, content, ...featureAst } = feature

    onAddFile({ content, location: parent.uuid })
  })

  const onFeatureDelete = useInline(async (feature:TRaceFeature) => {
    const loc = feature.parent.location
    const featFile = files[loc]
    if(!featFile) return console.warn(`Can not delete feature, missing feature file location`)

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
    onFeatureCreate,
    onFeatureActive,
    onFeatureChange,
    onFeatureDelete,
    onSettingChange,
    world: repo.world,
    onFeatureSave: onFeatureChange,
    connected: Boolean(repo?.paths && repo?.name)
  }
}