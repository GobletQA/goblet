import { deepFreeze } from '@keg-hub/jsutils'

export type TFileTypes = Record<string, string>

let FileTypes:Record<string, string> = deepFreeze({
    FEATURE: `feature`,
    REPORT: `report`,
    DEFINITION: `definition`,
    WAYPOINT: `waypoint`,
    UNIT: `unit`,
    SUPPORT: `support`,
    HTML: `html`,
    DOCS: `docs`,
    JSON: `json`
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

export enum StatusTypes {
  VNC = 'vnc',
  LOCAL = 'local',
}

export const SocketMsgTypes = {
  EXAM_RUN: `examRun`,
  EXAM_ABORT: `examAbort`,
  CMD_RUN: `cmdRun`,
  STD_OUT: `stdOut`,
  STD_ERR: `stdErr`,
  CMD_END: `cmdEnd`,
  CMD_FAIL: `cmdFail`,
  AUTH_TOKEN: `authToken`,
  BROWSER_PLAY: `browserPlay`,
  BROWSER_STATUS: `browserStatus`,
  BROWSER_RECORD: `browserRecord`,
  BROWSER_RESTART: `browserRestart`,
  CANCEL_AUTOMATE: `cancelAutomate`,
  BROWSER_AUTOMATE: `browserAutomate`,
}

export const CreateNewRepo = {
  value: 0,
  branches: [],
  id: `create-new-repo`,
  key:`create-new-repo`,
  label: `Create New Repo`,
}

export const CreateNewBranch = `Create new branch`
export const CreateBranchSelect = `create-branch-select`
