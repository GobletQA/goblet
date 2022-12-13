import type { TFilelist, TFileMeta } from '../../types'
import type { MutableRefObject } from 'react'

import { exists } from '@keg-hub/jsutils'
import { getModelFromPath } from '../editor/getModelFromPath'

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