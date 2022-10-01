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
  SIGN_IN = 'signIn',
  signIn = 'SIGN_IN',
  NO_LOCAL_MOUNT = 'noLocalMount',
  noLocalMount = 'NO_LOCAL_MOUNT',
  CONNECT_REPO = 'connectRepoModal',
  connectRepoModal = 'CONNECT_REPO',
  TEST_SELECTOR = 'testSelectorModal',
  testSelectorModal = 'TEST_SELECTOR',
} 


