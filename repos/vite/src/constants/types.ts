import { deepFreeze } from '@keg-hub/jsutils'

export type TFileTypes = Record<string, string>

let FileTypes:Record<string, string> = deepFreeze({
    FEATURE: 'feature',
    REPORT: 'report',
    DEFINITION: 'definition',
    WAYPOINT: 'waypoint',
    UNIT: 'unit',
    SUPPORT: 'support',
    HTML: 'html',
    DOCS: 'docs',
}) as TFileTypes

/**
 * Allows settings the file types from the server when they are loaded for a repo
 */
const setFileTypeConstants = (fileTypes:TFileTypes) => {
  FileTypes = deepFreeze({ ...FileTypes, ...fileTypes }) as TFileTypes
}

export {
  FileTypes,
  setFileTypeConstants
}

export enum ModalTypes {
  confirm = 'confirm',
  CONFIRM = 'confirm',
  CONNECT = 'connect',
  connect = 'connect',
  REPO = 'repo',
  repo = 'repo',
  SETTINGS = 'settings',
  settings = 'settings',
  SIGN_IN = 'signIn',
  signIn = 'signIn',
} 


