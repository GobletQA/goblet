import { fileTreeDispatch } from '@reducers'

export const clearFileTree = () => {
  fileTreeDispatch.clear()
}
