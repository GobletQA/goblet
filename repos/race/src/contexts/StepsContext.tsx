import type {
  TSetSteps,
  TRaceSteps,
} from '../types'

import { MemoChildren } from '@gobletqa/components'
import {
  useMemo,
  useState,
  useContext,
  createContext,
} from 'react'

export type TStepsProvider = {
  children:any
  steps?:TRaceSteps
}

export type TStepsCtx = {
  steps:TRaceSteps
  setSteps:TSetSteps
}

export const StepsContext = createContext<TStepsCtx>({} as TStepsCtx)
export const useSteps = () => useContext(StepsContext)

const useRaceSteps = (steps:TRaceSteps={}) => {
  return useMemo(() => {
    return Object.entries(steps).reduce((acc, [key, data]) => {
      data?.meta?.race && (acc[key] = data)

      return acc
    }, {} as TRaceSteps)
  }, [steps])
}


export const StepsProvider = (props:TStepsProvider) => {
  const {
    children,
  } = props

  const raceSteps = useRaceSteps(props.steps)
  const [steps, setSteps] = useState<TRaceSteps>(raceSteps)

  const stepCtx:TStepsCtx = useMemo(() => ({
    steps,
    setSteps
  }), [steps])

  return (
    <StepsContext.Provider value={stepCtx}>
      <MemoChildren children={children} />
    </StepsContext.Provider>
  )

}
