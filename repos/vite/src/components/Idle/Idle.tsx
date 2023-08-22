import type { ReactNode } from "react"
import {useIdleTimeout} from '@hooks/useIdleTimeout'

import { useMemo } from "react"
import { useContainer, useRepo } from "@store"
import { isEmptyColl } from "@keg-hub/jsutils/isEmptyColl"


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

const IdleTimer = (props:TIdle) => {
  useIdleTimeout()

  return (<>{props.children}</>)
}


export const Idle = (props:TIdle) => {
  const hasLoaded = useLoadedState()

  return hasLoaded
    ? (<IdleTimer {...props} />)
    : (<>{props.children}</>)
}