import type { TIdleConnection } from "@types"

import { useApp } from "@store"
import { useCallback } from 'react'
import { EAppStatus } from "@types"
import {setStatus} from "@actions/app/setStatus"
import {idleModal} from "@actions/modals/modals"
import { useOnEvent } from "@gobletqa/components"
import { SCIdleConnectionsEvt } from "@constants/events"

/**
 * Helper hook to track if the user is idle on the frontend
 */
export const useIdleTimeout = () => {

  const { status } = useApp()

  const onPrompt = useCallback((data?:TIdleConnection) => {
    if(status === EAppStatus.Idle) return

    setStatus(EAppStatus.Idle)
    idleModal({ visible: true })
  }, [status])

  useOnEvent<TIdleConnection>(SCIdleConnectionsEvt, onPrompt)

}
