import {toNum} from '@keg-hub/jsutils'

export * from '@gobletqa/shared/frontend/websocket'

export const WSReconnectInterval = toNum(process.env.GB_FE_WS_RECONNECT_INTERVAL) || 10
export const WSReconnectAttempts = toNum(process.env.GB_FE_WS_RECONNECT_ATTEMPTS) || 30
