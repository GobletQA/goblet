import type { TOnParkinInit } from '@GBR/types'
import type {
  TWorldConfig,
  TRegisterOrAddStep,
} from '@ltipton/parkin'

import { Parkin } from '@ltipton/parkin'
import { deepMerge, iife } from '@keg-hub/jsutils'
import { ParkinInitEvt } from '@GBR/constants/events'
import { ParkinWorker } from '@GBR/workers/parkin/parkinWorker'
import {
  useInline,
  onEmitEvent,
  MemoChildren,
  useEffectOnce,
} from '@gobletqa/components'
import {
  useMemo,
  useState,
  useContext,
  createContext,
} from 'react'

export type TParkinProvider = {
  children:any
  world?:TWorldConfig
  defs?:TRegisterOrAddStep
}

export type TUpdateWorld = (updated:TWorldConfig, replace:boolean) => void
export type TParkinCtx = {
  parkin:Parkin
  world:TWorldConfig
  updateWorld: TUpdateWorld
}

let __Parkin:Parkin
export const getParkin = () => __Parkin

const initParkin = (world:TWorldConfig={ $alias: {} }, defs?:TRegisterOrAddStep) => {
  __Parkin = __Parkin || new Parkin(world, defs)
 return __Parkin
}

export const ParkinContext = createContext<TParkinCtx>({} as TParkinCtx)
export const useParkin = () => useContext(ParkinContext)

export const ParkinProvider = (props:TParkinProvider) => {
  const { children, defs } = props

  const [parkin, setParkin] = useState<Parkin>(initParkin(props.world || {} as TWorldConfig, defs))
  const [world, setWorld] = useState<TWorldConfig>(parkin?.world)
  
  const updateWorld = useInline<TUpdateWorld>((updated:TWorldConfig, replace:boolean) => {
    ParkinWorker.setWorld(updated, replace)

    parkin.world = replace ? updated : deepMerge(parkin?.world, updated)
    setWorld(parkin?.world)
  })

  useEffectOnce(() => {
    iife(async () => {
      await ParkinWorker.init(parkin.world, defs)
      onEmitEvent<TOnParkinInit>(ParkinInitEvt, { parkin })
    })

    return () => {
      ParkinWorker.clearSteps()
      parkin?.steps?.clear?.()
      setParkin(undefined as any)
    }
  })

  const parkinCtx:TParkinCtx = useMemo(() => ({
    world,
    parkin,
    updateWorld
  }), [
    world,
    parkin,
    updateWorld
  ])

  return (
    <ParkinContext.Provider value={parkinCtx}>
      <MemoChildren children={children} />
    </ParkinContext.Provider>
  )

}
