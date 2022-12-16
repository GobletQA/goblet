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
  Confirm = 'confirm',
  CONFIRM = 'confirm',
  confirm = 'confirm',
  Connect = 'connect',
  CONNECT = 'connect',
  connect = 'connect',
  Repo = 'repo',
  REPO = 'repo',
  repo = 'repo',
  Settings = 'settings',
  SETTINGS = 'settings',
  settings = 'settings',
  SignIn = 'signIn',
  SIGN_IN = 'signIn',
  signIn = 'signIn',
} 

export enum StatusTypes {
  VNC = 'vnc',
  LOCAL = 'local',
}

export const SocketMsgTypes = {
  CMD_RUN: `cmdRun`,
  STD_OUT: `stdOut`,
  STD_ERR: `stdErr`,
  CMD_END: `cmdEnd`,
  CMD_FAIL: `cmdFail`,
  AUTH_TOKEN: `authToken`,
  BROWSER_PLAY: `browserPlay`,
  BROWSER_STATUS: `browserStatus`,
  BROWSER_RECORD: `browserRecord`,
}

export const BrowserLogTerminal = `browser-log`