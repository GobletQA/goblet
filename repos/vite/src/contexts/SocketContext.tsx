import type { ReactNode } from 'react'
import type { TRepoState, TContainerState, TUserState } from '@types'
import { EContainerState } from '@types'
import {
  memo,
  useMemo,
  useState,
  useEffect,
  useContext,
  createContext,
} from 'react'

import { useModal } from '@store'
import { EModalTypes } from '@types'
import { AuthActive } from '@constants'
import { noOpObj } from '@keg-hub/jsutils'
import { Fadeout } from '@components/Fadeout'
import { localStorage } from '@services/localStorage'
import { useContainer, useUser, useRepo } from '@store'
import { SocketService, WSService } from '@services/socketService'
import { getWebsocketConfig } from '@utils/api/getWebsocketConfig'
import { WaitOnContainer } from '@components/WaitOnContainer/WaitOnContainer'

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

const isValidState = (
  user?:TUserState,
  container?:TContainerState,
  repo?:TRepoState,
) => {
  return (!user || user && user?.id)
    && (!repo || repo?.name && repo?.git?.remote)
    && (!container || container?.api && container?.meta?.state === EContainerState.Running)
}

const useWSHooks = () => {

  const user = useUser()
  const repo = useRepo()
  const container = useContainer()
  const [fade, setFade] = useState(false)
  const [wsService, setWSService] = useState<SocketService>()

  useEffect(() => {
    !fade
      && isValidState(user, container, repo)
      && setFade(true)
  }, [
    fade,
    user?.id,
    repo?.name,
    container?.api,
    repo?.git?.remote,
    container?.meta?.state
  ])


  const fadeContent = useMemo(() => {
    if(!user?.id) return `User not authorized. Please login`

    // Check for invalid state, or missing web socket
    return !isValidState(user, container, repo) || !wsService?.socket
      ? `Waiting for session to initialize...`
      : ``
  }, [
    user?.id,
    repo?.name,
    container?.api,
    repo?.git?.remote,
    wsService?.socket,
    container?.meta?.state
  ])


  useEffect(() => {
    // Check if the web socket has been set, or for invalid state
    if(wsService?.socket || !isValidState(user, container, repo)) return

    (async () => {
      const jwt = await localStorage.getJwt()
      // Once the container?.api is loaded, then init the websocket
      const wsConfig = getWebsocketConfig(container.api)
      WSService.initSocket(wsConfig, jwt)

      // Now update the state to include the websocket
      // This way we don't initialize until the session container is running
      setWSService(WSService)

    })()

  }, [
    user?.id,
    repo?.name,
    container.api,
    repo?.git?.remote,
    wsService?.socket,
    container?.meta?.state
  ])

  return {
    fade,
    wsService,
    fadeContent
  }

}

const SocketChildren = memo((props:TSocketChildren) => {
  const modal = useModal()

  const {
    wsActive,
    children,
    content,
    ...rest
  } = props

  const disable = modal.visible
    && (modal?.type === EModalTypes.connect || modal?.type === EModalTypes.signIn)

  return (
    <>
      {wsActive && props.children}
      {AuthActive && (
        <Fadeout
          {...rest}
          content={
            disable ? null : (<WaitOnContainer timeoutMessage={content} />)
          }
        />
      )}
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
