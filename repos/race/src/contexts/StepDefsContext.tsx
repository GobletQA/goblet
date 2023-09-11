import type { TStepDefsList } from '@ltipton/parkin'
import type { TSetSteps } from '../types'

import { MemoChildren, TAutoOpt, useInline } from '@gobletqa/components'
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
  setDefs:TSetSteps
  defs:TStepDefsList
  options:TAutoOpt[]
}

export const StepDefsContext = createContext<TStepDefsCtx>({} as TStepDefsCtx)
export const useStepDefs = () => useContext(StepDefsContext)

const loopDefs = (defs:TStepDefsList={}) => {
  const opts:TAutoOpt[] = []
  
  const list = Object.entries(defs).reduce((acc, [key, data]) => {
    if(!data?.meta?.race) return acc

    const {
      info,
      name,
      alias,
      description,
    } = data?.meta

    acc[key] = data
    if(!name) return acc

    opts.push({
      alias,
      id: key,
      label: name,
      type: data.type,
      uuid: data.uuid,
      info: info || description,
    })

    return acc
  }, {} as TStepDefsList)

  return {
    list,
    opts: opts.sort((a, b) => a.label.localeCompare(b.label)),
  }
}


export const StepDefsProvider = (props:TStepDefsProvider) => {
  const {
    children,
  } = props

  const { list, opts } = useMemo(() => loopDefs(props.defs), [props.defs])
  const [defs, _setDefs] = useState<TStepDefsList>(list)
  const [options, setOpts] = useState<TAutoOpt[]>(opts)
  
  const setDefs = useInline((update:TStepDefsList) => {
    const { list, opts } = loopDefs(update)
    _setDefs(list)
    setOpts(opts)
  })

  const defsCtx:TStepDefsCtx = useMemo(() => ({
    defs,
    setDefs,
    options,
  }), [defs])

  return (
    <StepDefsContext.Provider value={defsCtx}>
      <MemoChildren children={children} />
    </StepDefsContext.Provider>
  )

}
