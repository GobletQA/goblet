import type { TFileModel } from '@types'
import type { TActiveFile } from '@utils/editor/getActiveFile'

import { getFileModel } from '@utils/files/getFileModel'
import { getActiveFile } from '@utils/editor/getActiveFile'

export type TActiveFileMeta = Partial<TActiveFile> & {model?:TFileModel|null}

export const getActiveFileMeta = async ():Promise<TActiveFileMeta> => {
  const activeFile = await getActiveFile()
  return activeFile?.location
    ? {...activeFile, model: getFileModel(activeFile?.location)}
    : {}
}
