import type { IIdleTimer, IIdleTimerProps } from "react-idle-timer"


import { useApp } from "@store"
import { EAppStatus } from "@types"
import { emptyObj } from "@keg-hub/jsutils"
import {useInline} from "@gobletqa/components"
import { useIdleTimer } from "react-idle-timer"
import {setStatus} from "@actions/app/setStatus"
import {idleModal} from "@actions/modals/modals"
import { IdleTimeout, IdlePromptTimeout } from "@constants/values"
import { signOutManually } from '@actions/admin/user/signOutManually'

export type TIdleTimeout = Partial<IIdleTimerProps>




/**
 * Helper hook to track if the user is idle on the frontend
 */
export const useIdleTimeout = (props:TIdleTimeout=emptyObj) => {

  const { status } = useApp()

    const onIdle = useInline(() => {
      signOutManually({ idleSignOut: true })
    })

    const onPrompt = useInline((evt?:Event, idleTimer?:IIdleTimer) => {
      if(status === EAppStatus.Idle) return

      setStatus(EAppStatus.Idle)
      idleModal({ visible: true })
    })

    const timeout = (props?.timeout || IdleTimeout) * 1000
    const promptBeforeIdle = (props?.promptBeforeIdle || IdlePromptTimeout) * 1000

    const idleTimer = useIdleTimer({
      onIdle,
      onPrompt,
      debounce: 500,
      ...props,
      timeout,
      promptBeforeIdle,
    })

    return {
      idleTimer
    }
}
