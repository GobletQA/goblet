import type { TFileModel } from '../types'
import { buildModel } from './buildModel'
/**
 * Models a file loaded into memory
 * @typedef FileModel
 * @property {string} name - Name of the file on disk
 * @property {string} location - Absolute path of the file on dist
 * @property {string} relative - Relative path to the root of goblet
 * @property {string} content - Text content of the file
 * @property {string} fileType - Type of test feature / jest / waypoint,
 * @property {string} mime - Mime file type relative to the file extension
 * @property {Object} [ast] - File parsed into an ast format. Different per file type
 * @property {string} uuid - Local id of the file created when the model is created
 */
const Model = {
  name: '',
  ext: '',
  location: '',
  relative: '',
  content: '',
  fileType: 'file',
  mime: 'text/plain',
  worldFile: false,
  gobletFile: false,
  ast: {},
  uuid: '',
}

export const fileModel = (overrides:Partial<TFileModel>):TFileModel => buildModel<TFileModel>(overrides, Model)

