import type { MutableRefObject } from 'react'
import type { TFilelist, TFileMeta } from '@GBM/types'

import { exists } from '@keg-hub/jsutils/exists'
import { getModelFromPath } from '@GBM/utils/editor/getModelFromPath'

export const saveFile = (
  file:TFileMeta,
  filesRef: MutableRefObject<TFilelist>,
  onSaveFile?: (path: string, content: string) => void
) => {
  const model = getModelFromPath(file.path)
  const content = model?.getValue()

  if(!exists<string>(content)) return

  filesRef.current[file.path] = content
  onSaveFile?.(file.path, content)
}