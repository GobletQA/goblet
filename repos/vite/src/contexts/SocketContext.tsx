import type { ReactNode } from 'react'
import { EContainerState } from '@types'

import {
  memo,
  useMemo,
  useState,
  useEffect,
  useContext,
  createContext,
} from 'react'

import { AuthActive } from '@constants'
import { noOpObj } from '@keg-hub/jsutils'
import { Fadeout } from '@components/Fadeout'
import { useContainer, useUser } from '@store'
import { SocketService, WSService } from '@services/socketService'
import { getWebsocketConfig } from '@utils/api/getWebsocketConfig'

export type TSocketProvider = {
  children: ReactNode
}

export type TSocketChildren = {
  start: boolean
  content:ReactNode
  wsActive: boolean
  children: ReactNode
}

export const SocketContext = createContext<SocketService>(noOpObj as SocketService)

export const useSocket = () => {
  return useContext(SocketContext)
}

const useWSHooks = () => {

  const user = useUser()
  const container = useContainer()
  const [fade, setFade] = useState(false)
  const [wsService, setWSService] = useState<SocketService|null>(null)

  useEffect(() => {
    !fade
      && user?.id
      && container?.meta?.state !== EContainerState.Running
      && setFade(true)
  }, [fade, user?.id, container?.meta?.state])


  const fadeContent = useMemo(() => {
    if(!user?.id) return `User not authorized. Please login`
    
    const cState = container?.meta?.state
    return cState !== EContainerState.Running || !wsService?.socket || !container?.api
      ? `Waiting for Backend service to initialize...`
      : ``
  }, [
    user?.id,
    container?.api,
    wsService?.socket,
    container?.meta?.state
  ])


  useEffect(() => {
    if(wsService?.socket || !container?.api) return

    // Once the container?.api is loaded, then init the websocket
    const wsConfig = getWebsocketConfig(container.api)
    WSService.initSocket(wsConfig)

    // Now update the state to include the websocket
    // This way we don't initialize until the session container is running
    setWSService(WSService)
  }, [
    container.api,
    wsService?.socket
  ])

  return {
    fade,
    wsService,
    fadeContent
  }

}

const SocketChildren = memo((props:TSocketChildren) => {
  const {
    wsActive,
    children,
    ...rest
  } = props
  
  
  return (
    <>
      {wsActive && props.children}
      {AuthActive && (<Fadeout {...rest} />)}
    </>
  )
  
})

export const SocketProvider = (props:TSocketProvider) => {
  const { children } = props
  const {
    fade,
    wsService,
    fadeContent,
  } = useWSHooks()

  return (
    <SocketContext.Provider value={wsService as SocketService}>
      <SocketChildren
        start={fade}
        children={children}
        content={fadeContent}
        wsActive={Boolean(wsService)}
      />
    </SocketContext.Provider>
  )
}
