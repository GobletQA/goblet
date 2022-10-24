import type { TFileModel } from '@types'
import { filesDispatch } from '@store'


export const setFile = (file:TFileModel) => {
  filesDispatch.setFile(file)
}