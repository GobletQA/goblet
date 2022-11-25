import type { TSocket } from '@types'

import { createContext, useContext, memo, useEffect, useState } from 'react'
import { noOpObj } from '@keg-hub/jsutils'
import { useContainer, useUser } from '@store'
import { SocketService, WSService } from '@services/socketService'
import { getWebsocketConfig } from '@utils/api/getWebsocketConfig'

export type TSocketChildren = {
  children: any
}

export const SocketContext = createContext<SocketService>(noOpObj as SocketService)

export const useSocket = () => {
  return useContext(SocketContext)
}

const SocketChildren = memo((props:Omit<TSocketChildren, `config`>) => {
  return (<>{props.children}</>)
})

export const SocketProvider = (props:TSocketChildren) => {
  const { children } = props
  const user = useUser()
  const container = useContainer()

  // Default the initial service to null
  // Then in the useEffect, wait for the container.api to be loaded
  const [wsService, setWSService] = useState<SocketService|null>(null)

  useEffect(() => {
    if(wsService?.socket || !container?.api) return

    // Once the container?.api is loaded, then init the websocket
    const wsConfig = getWebsocketConfig(container.api)
    WSService.initSocket(wsConfig)

    // Now update the state to include the websocket
    // This way we don't initialize until the session container is running
    setWSService(WSService)
  }, [user, container])


  return (
    <SocketContext.Provider value={wsService as SocketService}>
      <SocketChildren children={children} />
    </SocketContext.Provider>
  )
}
