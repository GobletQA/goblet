import type { TFileTree } from '@types'
import { fileTreeDispatch } from '@store'


export const setFileTree = (fileTree:TFileTree) => {
  // Currently this resets the entire file tree
  // Need to come up with a way to save the state sidenav opened tree
  // That way if this is called, the sidenav items that are open remain open if they still exist
  fileTreeDispatch.setFileTree(fileTree)
}
