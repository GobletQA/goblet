import type { TFileTreeNode } from '@types'

import { getStore } from '@store'
import { loadApiFile } from '@utils/api'
import { isObj } from '@keg-hub/jsutils'
import { setFile } from '../local/setFile'
import { addToast } from '../../toasts/addToast'

/**
 * Helper to find the treeNodeModel of the passed in file
 * Matches a node, a node's location or a node's name
 */
const findFileInTree = (
  nodes:TFileTreeNode[],
  file:TFileTreeNode|string
) =>
  nodes.find(
    node => node === file || node.location === file || node.name === file
  )

/**
 * Sets a test file as the activeFile, after loading it's fileModel from the backend
 * Then calls setActiveFileFromType to set the file Active
 */
export const loadFile = async (
  fileNode:TFileTreeNode|string,
  mergeQuery?:boolean
) => {
  const { fileTree } = getStore()?.getState()
  if (!fileTree || !fileTree?.nodes?.length || !fileTree?.rootPaths?.length) return

  const fileName = isObj<TFileTreeNode>(fileNode) ? fileNode.name : fileNode
  
  const nodeToLoad = findFileInTree(fileTree.nodes, fileNode)
  if (!nodeToLoad)
    return addToast({
      type: `warn`,
      message: `Could not load file ${fileName}. It does not exist in the file tree`,
    })

  const resp = await loadApiFile(nodeToLoad)
  if(!resp)
    return addToast({
      type: `warn`,
      message: `Could not load file ${fileName} from the API!`,
    })


  setFile(resp?.data?.file)

}
