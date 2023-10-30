import type { TIdleConnection } from "@types"

import { useApp } from "@store"
import { EAppStatus } from "@types"
import {setStatus} from "@actions/app/setStatus"
import {idleModal} from "@actions/modals/modals"
import { SCIdleConnectionsEvt } from "@constants/events"
import { useInline, useOnEvent } from "@gobletqa/components"

/**
 * Helper hook to track if the user is idle on the frontend
 */
export const useIdleTimeout = () => {

  const { status } = useApp()

  const onPrompt = useInline((data?:TIdleConnection) => {
    if(status === EAppStatus.Idle) return

    setStatus(EAppStatus.Idle)
    idleModal({ visible: true })
  })

  useOnEvent<TIdleConnection>(SCIdleConnectionsEvt, onPrompt)

}
