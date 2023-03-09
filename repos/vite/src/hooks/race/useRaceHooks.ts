import type { TRaceFeature } from '@gobletqa/race'

import { useDefs, useRepo } from '@store'
import { useMemo } from 'react'
import { useRaceSteps } from './useRaceSteps'
import { useInline } from '@gobletqa/components'
import { useRaceFeatures } from './useRaceFeatures'
import { getFeaturePrefix } from '@utils/features/getFeaturePrefix'

import {
  useOnAddFile,
  useOnLoadFile,
  useOnSaveFile,
  useFeatureFiles,
  useOnRenameFile,
  useOnDeleteFile,
  useOnPathChange,
} from '../files'

export const useRaceHooks = () => {
  const repo = useRepo()
  const defs = useDefs()
  const files = useFeatureFiles()
  const steps = useRaceSteps(defs)

  const features = useRaceFeatures(files)
  const rootPrefix = useMemo(() => getFeaturePrefix(repo), [repo?.paths])
  const onSaveFile = useOnSaveFile(files, rootPrefix)

  // const onLoadFile = useOnLoadFile(files, rootPrefix)
  // const onPathChange = useOnPathChange(files, rootPrefix)
  // const onDeleteFile = useOnDeleteFile(files, rootPrefix)
  // const onAddFile = useOnAddFile(files, rootPrefix, repo)
  // const onRenameFile = useOnRenameFile(files, rootPrefix)

  const onFeatureChange = useInline((feature:TRaceFeature) => {
    if(!feature?.parent?.uuid)
      return console.warn(`Failed to save feature, feature is missing the parent file path`)
    
    const fileModel = files[feature?.parent?.uuid]
    if(!fileModel) return console.warn(`Failed to save feature, can not find the file in the feature store`)

    const { parent, path, ...featureAst } = feature

    onSaveFile(
      parent.uuid,
      feature.content,
      { ast:[featureAst] }
    )
  })

  return {
    steps,
    features,
    rootPrefix,
    onFeatureChange,
    connected: Boolean(repo?.paths && repo?.name)
  }
}