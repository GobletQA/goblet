import { useEffect, useState } from 'react'
import {useInline} from '@gobletqa/components'
import { useIdleTimer } from 'react-idle-timer'

const timeout = 10_000
const promptBeforeIdle = 4_000

export enum EIdleState {
  Idle=`Idle`,
  Active=`Active`,
  Prompted=`Prompted`
}


export const useIdleTimeout = () => {

  const [open, setOpen] = useState<boolean>(false)
  const [state, setState] = useState<string>(EIdleState.Active)
  const [remaining, setRemaining] = useState<number>(timeout)

  const onIdle = useInline(() => {
    setState(EIdleState.Idle)
    setOpen(false)
  })

  const onActive = useInline(() => {
    setState(EIdleState.Active)
    setOpen(false)
  })

  const onPrompt = useInline(() => {
    setState(EIdleState.Prompted)
    setOpen(true)
  })

  const { getRemainingTime, activate } = useIdleTimer({
    onIdle,
    onActive,
    onPrompt,
    timeout,
    promptBeforeIdle,
    throttle: 500
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(Math.ceil(getRemainingTime() / 1000))
    }, 500)

    return () => {
      clearInterval(interval)
    }
  })

  const onNotIdle = useInline(() => activate())

  const timeTillPrompt = Math.max(remaining - promptBeforeIdle / 1000, 0)
  const seconds = timeTillPrompt > 1 ? 'seconds' : 'second'

  return {
    onIdle,
    onPrompt,
    onActive,
    activate,
    onNotIdle,
  }

}