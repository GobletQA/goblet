import type { TRaceFeature } from '@GBR/types'
import type { TEditorCtx } from '@GBR/contexts/EditorContext'

import { getEditor } from '@GBR/utils/editor/getEditor'
import { ParkinWorker } from '@GBR/workers/parkin/parkinWorker'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'
import { renameFeatureProps } from '@GBR/utils/features/renameFeatureProps'
import { renameFeatureInGroup } from '@GBR/utils/features/renameFeatureInGroup'

export type TRenameFeature = {
  newName?:string
  oldName:string
  feature:TRaceFeature
}

export type TUpdateNonActive = {
  editor:TEditorCtx
  feature:TRaceFeature
  renamed:TRaceFeature
}

export type TUpdateActive = {
  editor:TEditorCtx
  feature:TRaceFeature
  renamed:TRaceFeature
}

const updateNonActive = async ({
  editor,
  feature,
  renamed,
}:TUpdateNonActive) => {
  const {
    featureGroups,
    getOpenedTabs,
    onFolderRename,
    setTabsAndGroups,
  } = editor

  const updated = await ParkinWorker.reIndex({ feature: renamed })
  
  onFolderRename?.(updated, feature.parent.location, updated.content)

  const tabs = getOpenedTabs()
  const groups = renameFeatureInGroup({
    tabs,
    feature: updated,
    oldLoc: feature.path,
    newLoc: updated.path,
    features: { items: featureGroups },
  })

  setTabsAndGroups(groups)

}

/**
 * This method is different than a feature title rename
 * It updates both the feature title, AND the file name that contains the feature
 */
export const renameFeature = async ({
  feature,
  oldName,
  newName=feature.feature,
}:TRenameFeature) => {
  const { editor } = await getEditor()
  const { feature:activeFeat } = await getFeature()

  const renamed:TRaceFeature = {
    ...feature,
    ...renameFeatureProps({ newName, oldName, feature })
  }

  return activeFeat.uuid === feature.uuid
    ? updateFeature(renamed, { rename: true })
    : await updateNonActive({ editor, renamed, feature })

}