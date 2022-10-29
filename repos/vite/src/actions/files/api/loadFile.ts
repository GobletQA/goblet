import type { TFileTreeNode, TFileTree } from '@types'

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


const getFileTreeNode = (fileNode:TFileTreeNode|string) => {
  if(isObj<TFileTreeNode>(fileNode))
    return { node: fileNode, name: fileNode.name }

  const { fileTree } = getStore()?.getState()
  if (!fileTree || !fileTree?.nodes?.length || !fileTree?.rootPaths?.length)
    return { name: fileNode }

  const node = findFileInTree(fileTree.nodes, fileNode)
  return { node, name: fileNode }
}

/**
 * Sets a test file as the activeFile, after loading it's fileModel from the backend
 * Then calls setActiveFileFromType to set the file Active
 */
export const loadFile = async (
  fileNode:TFileTreeNode|string,
) => {

  const { node, name } = getFileTreeNode(fileNode)

  if (!node)
    return addToast({
      type: `warn`,
      message: `Could not load file ${name}. It does not exist in the file tree`,
    })

  const resp = await loadApiFile(node)

  if(!resp)
    return addToast({
      type: `warn`,
      message: `Could not load file ${name} from the API!`,
    })

  const file = resp?.data?.file

  setFile(file)

  return file
}
