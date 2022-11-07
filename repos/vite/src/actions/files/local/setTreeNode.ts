import type { TFileTreeNode } from '@types'
import { fileTreeDispatch } from '@store'
import { isObj } from '@keg-hub/jsutils'

export const setTreeNode = (node:TFileTreeNode) => {
  isObj(node)
    ? fileTreeDispatch.setNode(node)
    : console.warn(`Can not set non-object as a file tree node!`)
}