import type { TFileTreeNode } from '@types'
import { fileTreeDispatch } from '@store'
import { isObj } from '@keg-hub/jsutils'

export const removeTreeNode = (node:string|TFileTreeNode) => {
  const loc = isObj<TFileTreeNode>(node) ? node.id : node
  fileTreeDispatch.removeNode(loc)
}