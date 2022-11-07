import { filesDispatch } from '@store'

export const clearFileTree = () => {
  filesDispatch.clear()
}
