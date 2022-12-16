import type * as WebSocketEvents from '../libs/websocket/events'
export type { SocketManager } from '../libs/websocket/manager'

export type TWebSocketEvent = keyof typeof WebSocketEvents
export type TWebSocketEvents = typeof WebSocketEvents