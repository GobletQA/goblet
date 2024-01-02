import { addRootToLoc } from '@utils/repo/addRootToLoc'
import { getActiveFile } from '@utils/editor/getActiveFile'
import { getFeaturePrefix } from '@utils/features/getFeaturePrefix'

export const getActiveFeature = async () => {
  const { content, location, editor, ast } = await getActiveFile()
  const featPrefix = getFeaturePrefix()
  const full = addRootToLoc(location, featPrefix)

  return { content, location: full, editor, ast }
}
