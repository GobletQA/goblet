import type { TOnWorldUpdate, TOnParkinInit, TOnWorldChange } from '@GBR/types'
import type {
  TWorldConfig,
  TRegisterOrAddStep,
} from '@ltipton/parkin'

import { Parkin } from '@ltipton/parkin'
import { deepMerge, iife } from '@keg-hub/jsutils'
import { ParkinWorker } from '@GBR/workers/parkin/parkinWorker'
import { ParkinInitEvt, UpdateWorldEvt } from '@GBR/constants/events'
import {
  useInline,
  useOnEvent,
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
  onWorldChange?:TOnWorldChange
}

export type TParkinCtx = {
  parkin:Parkin
  world:TWorldConfig
  updateWorld: TOnWorldChange
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
  const {
    defs,
    children,
    onWorldChange
  } = props

  const [parkin, setParkin] = useState<Parkin>(initParkin(props.world || {} as TWorldConfig, defs))
  const [world, setWorld] = useState<TWorldConfig>(parkin?.world)
  
  const updateWorld = useInline<TOnWorldChange>(({ world:updated, replace}) => {
    parkin.world = replace ? updated : deepMerge(parkin?.world, updated)
    ParkinWorker.setWorld(parkin.world, false)

    onWorldChange?.({ world: parkin?.world, replace })

    setWorld(parkin?.world)
  })

  useOnEvent<TOnWorldUpdate>(UpdateWorldEvt, updateWorld)

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
