import type { ReactNode } from "react"
import { memo } from "react"
import {useIdleTimeout} from '@hooks/useIdleTimeout'

import { useMemo } from "react"
import { useContainer, useRepo } from "@store"
import { isEmptyColl } from "@keg-hub/jsutils"


export type TIdle = {
  children:ReactNode
}

const useLoadedState = () => {
  const repo = useRepo()
  const container = useContainer()

  return useMemo(() => {
    return !isEmptyColl(repo) && !isEmptyColl(container)
  }, [repo, container])
}

const IdleTimer = memo((props:TIdle) => {
  useIdleTimeout()

  return (<>{props.children}</>)
}, () => false)


export const Idle = (props:TIdle) => {
  const hasLoaded = useLoadedState()

  return hasLoaded
    ? (<IdleTimer {...props} />)
    : (<>{props.children}</>)
}