import type { TIdleConnection } from "@types"

import { useCallback } from 'react'
import { useApp, useModal } from "@store"
import { EAppStatus, EModalTypes } from '@types'
import {setStatus} from "@actions/app/setStatus"
import {idleModal} from "@actions/modals/modals"
import { useOnEvent } from "@gobletqa/components"
import { SCIdleConnectionsEvt } from "@constants/events"

/**
 * Helper hook to track if the user is idle on the frontend
 */
export const useIdleTimeout = () => {

  const { status } = useApp()
  const { type, visible } = useModal()

  const onPrompt = useCallback((data?:TIdleConnection) => {

    if(data?.state && status !== data?.state)
      setStatus(data?.state)

    if(data?.state === EAppStatus.Active){
      type === EModalTypes.Idle
        && visible
        && idleModal({ visible: false })

      return
    }

    else if(data?.state === EAppStatus.Shutdown){
      status !== EAppStatus.Shutdown
        && setStatus(EAppStatus.Shutdown)
      
      idleModal({ visible: false })
      idleModal({ visible: true })

      return
    }

    // If already set to idle, then check for shutdown status
    else if(status === EAppStatus.Idle) return

    setStatus(EAppStatus.Idle)
    idleModal({ visible: true })
  }, [status, type, visible])

  useOnEvent<TIdleConnection>(SCIdleConnectionsEvt, onPrompt)

}
