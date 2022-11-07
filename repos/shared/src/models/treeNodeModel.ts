import type { TTreeNodeModel } from '../types'
import { buildModel } from './buildModel'

/**
 * Models a file tree node
 * @typedef FileModel
 * @property {string} id - Unique identifier
 * @property {string} name - Name of the file on disk
 * @property {string} type - content type at the location (folder / file)
 * @property {Array} children - Child tree nodes when type is a folder
 * @property {string} location - Absolute path of the file on dist
 */
const Model = {
  id: '',
  name: '',
  type: '',
  fileType: '',
  location: '',
  children: {} as Record<string, TTreeNodeModel>,
}

export const treeNodeModel = (overrides:Partial<TTreeNodeModel>):TTreeNodeModel => buildModel<TTreeNodeModel>(overrides, Model)
