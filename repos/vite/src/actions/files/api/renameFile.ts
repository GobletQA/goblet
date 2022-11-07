import type { TFileModel } from '@types'

import { getStore } from '@store'
import { noOpObj } from '@keg-hub/jsutils'
import { renameApiFile } from '@utils/api'
import { addToast } from '@actions/toasts'
import { setFile } from '@actions/files/local/setFile'
import { setTreeNode } from '@actions/files/local/setTreeNode'
import { removeTreeNode } from '@actions/files/local/removeTreeNode'

const updateFileTree = (
  oldLoc:string,
  newLoc:string,
  file: TFileModel,
) => {
  const { fileTree } = getStore().getState()
  const node = fileTree?.nodes?.[oldLoc]
  if(!node) return

  setTreeNode({
    ...node,
    name: file.name,
    id: file.location,
    location: file.location,
  })

  removeTreeNode(oldLoc)

}

/**
 * Save the content to the given file. if no filePath passed in. it will save it on the currently active file
 */
export const renameFile = async (
  oldLoc:string,
  newLoc:string
) => {

  if (!oldLoc || !newLoc)
    return console.warn('Old file location and new file location are required')

  addToast({
    type: `info`,
    message: `Renaming file to ${newLoc}!`,
  })

  const resp = await renameApiFile({
    oldLoc,
    newLoc
  })
  if(!resp?.success) return noOpObj as Record<"file", TFileModel>

  addToast({
    type: `success`,
    message: `File was renamed to ${newLoc}!`,
  })

  const { file } = resp?.data
  if(file){
    setFile(file)
    updateFileTree(
      oldLoc,
      newLoc,
      file
    )
  }

  return resp?.data
}
