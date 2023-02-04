import type {
  TSetSteps,
  TRaceStepDefs,
} from '../types'

import { MemoChildren } from '@gobletqa/components'
import {
  useMemo,
  useState,
  useContext,
  createContext,
} from 'react'

export type TStepDefsProvider = {
  children:any
  defs?:TRaceStepDefs
}

export type TStepDefsCtx = {
  defs:TRaceStepDefs
  setDefs:TSetSteps
}

export const StepDefsContext = createContext<TStepDefsCtx>({} as TStepDefsCtx)
export const useStepDefs = () => useContext(StepDefsContext)

const useRaceSteps = (defs:TRaceStepDefs={}) => {
  return useMemo(() => {
    return Object.entries(defs).reduce((acc, [key, data]) => {
      data?.meta?.race && (acc[key] = data)

      return acc
    }, {} as TRaceStepDefs)
  }, [defs])
}

export const StepDefsProvider = (props:TStepDefsProvider) => {
  const {
    children,
  } = props

  const raceSteps = useRaceSteps(props.defs)
  const [defs, setDefs] = useState<TRaceStepDefs>(raceSteps)

  const defsCtx:TStepDefsCtx = useMemo(() => ({
    defs,
    setDefs
  }), [defs])

  return (
    <StepDefsContext.Provider value={defsCtx}>
      <MemoChildren children={children} />
    </StepDefsContext.Provider>
  )

}
