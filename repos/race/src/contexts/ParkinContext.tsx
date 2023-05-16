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

/**
 * TODO: Update so that this parkin version is no longer needed
 * All parkin calls will use the ParkinWorker version
 */
let __Parkin:Parkin
export const getParkin = () => __Parkin

const useInitParkin = (props:TParkinProvider) => {
  return useMemo<Parkin>(() => {
    __Parkin = __Parkin
      || new Parkin(props.world || {} as TWorldConfig, props.defs)

    iife(async () => {
      await ParkinWorker.init(__Parkin.world, props.defs)
      onEmitEvent<TOnParkinInit>(ParkinInitEvt, { parkin: __Parkin })
    })

    return __Parkin
  }, [])
}


export const ParkinContext = createContext<TParkinCtx>({} as TParkinCtx)
export const useParkin = () => useContext(ParkinContext)

export const ParkinProvider = (props:TParkinProvider) => {
  const {
    children,
    onWorldChange
  } = props

  const parkin = useInitParkin(props)
  const [world, setWorld] = useState<TWorldConfig>(parkin?.world)
  
  const updateWorld = useInline<TOnWorldChange>(({ world:updated, replace}) => {
    parkin.world = replace ? updated : deepMerge(parkin?.world, updated)
    ParkinWorker.setWorld(parkin.world, false)

    onWorldChange?.({ world: parkin?.world, replace })

    setWorld(parkin?.world)
  })

  useOnEvent<TOnWorldUpdate>(UpdateWorldEvt, updateWorld)

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
