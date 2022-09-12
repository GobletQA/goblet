import { setItems } from 'GBActions'
import { Values } from 'GBConstants'

const { CATEGORIES } = Values

export const clearFileTree = () => {
  setItems(CATEGORIES.FILE_TREE, {})
}
