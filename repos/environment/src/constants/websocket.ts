export const TagPrefix = `SOCKET`
export const AuthTokenHeader = `SOCKET-AUTH-TOKEN`

// General
export const WSInit = `${TagPrefix}:INIT`
export const WSSetId = `${TagPrefix}:SET_ID`
export const WSConnect = `${TagPrefix}:CONNECT`
export const WSIdleStatus = `${TagPrefix}:IDLE_STATUS`

// STORE
export const WS_UPDATE_STORE = `${TagPrefix}:UPDATE_STORE`

// Auth
export const WSAuthToken = `${TagPrefix}:AUTH_TOKEN`
export const WSNotAuthorized = `${TagPrefix}:NOT_AUTHORIZED`

// Peer
export const WSAddPeer = `${TagPrefix}:ADD_PEER`
export const WSPeerDisconnect = `${TagPrefix}:PEER_DISCONNECT`

// Command
export const WSRunCmd = `${TagPrefix}:RUN_CMD`
export const WSCmdEnd = `${TagPrefix}:CMD_END`
export const WSCmdOut = `${TagPrefix}:CMD_OUT`
export const WSCmdErr = `${TagPrefix}:CMD_ERR`
export const WSCmdFail = `${TagPrefix}:CMD_FAIL`
export const WSSetCmds = `${TagPrefix}:SET_CMDS`
export const WSCmdRunning = `${TagPrefix}:CMD_RUNNING`

// Playwright
export const WSPwLog = `${TagPrefix}:PW_LOG`
export const WSPwUrlChange = `${TagPrefix}:PW_URL_CHANGE`
export const WSPwBrowserRestarted = `${TagPrefix}:PW_BROWSER_RESTARTED`