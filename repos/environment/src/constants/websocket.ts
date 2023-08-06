export const TagPrefix = `SOCKET`
export const AuthTokenHeader = `SOCKET-AUTH-TOKEN`

// General
export const WS_INIT = `${TagPrefix}:INIT`
export const WS_SET_ID = `${TagPrefix}:SET_ID`
export const WS_CONNECT = `${TagPrefix}:CONNECT`

// STORE
export const WS_UPDATE_STORE = `${TagPrefix}:UPDATE_STORE`

// Auth
export const WS_AUTH_TOKEN = `${TagPrefix}:AUTH_TOKEN`
export const WS_NOT_AUTHORIZED = `${TagPrefix}:NOT_AUTHORIZED`

// Peer
export const WS_ADD_PEER = `${TagPrefix}:ADD_PEER`
export const WS_PEER_DISCONNECT = `${TagPrefix}:PEER_DISCONNECT`

// Command
export const WS_SET_CMDS = `${TagPrefix}:SET_CMDS`
export const WS_RUN_CMD = `${TagPrefix}:RUN_CMD`
export const WS_CMD_RUNNING = `${TagPrefix}:CMD_RUNNING`
export const WS_CMD_END = `${TagPrefix}:CMD_END`
export const WS_CMD_OUT = `${TagPrefix}:CMD_OUT`
export const WS_CMD_ERR = `${TagPrefix}:CMD_ERR`
export const WS_CMD_FAIL = `${TagPrefix}:CMD_FAIL`

// Playwright
export const WS_PW_LOG = `${TagPrefix}:PW_LOG`
export const WS_PW_URL_CHANGE = `${TagPrefix}:PW_URL_CHANGE`
