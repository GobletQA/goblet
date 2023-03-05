import type { TStepDefsList } from '@ltipton/parkin'
import type { TSetSteps } from '../types'

import { MemoChildren } from '@gobletqa/components'
import {
  useMemo,
  useState,
  useContext,
  createContext,
} from 'react'

export type TStepDefsProvider = {
  children:any
  defs?:TStepDefsList
}

export type TStepDefsCtx = {
  defs:TStepDefsList
  setDefs:TSetSteps
}

export const StepDefsContext = createContext<TStepDefsCtx>({} as TStepDefsCtx)
export const useStepDefs = () => useContext(StepDefsContext)

const useRaceSteps = (defs:TStepDefsList={}) => {
  return useMemo(() => {
    return Object.entries(defs).reduce((acc, [key, data]) => {
      data?.meta?.race && (acc[key] = data)

      return acc
    }, {} as TStepDefsList)
  }, [defs])
}

export const StepDefsProvider = (props:TStepDefsProvider) => {
  const {
    children,
  } = props

  const raceSteps = useRaceSteps(props.defs)
  const [defs, setDefs] = useState<TStepDefsList>(raceSteps)

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
