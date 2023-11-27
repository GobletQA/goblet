import type { TOnWorldUpdate, TOnParkinInit, TOnWorldChange } from '@GBR/types'
import type {
  TWorldConfig,
  TRegisterOrAddStep,
} from '@ltipton/parkin'


import { ife } from '@keg-hub/jsutils'
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

export type TWorldProvider = {
  children:any
  world?:TWorldConfig
  defs?:TRegisterOrAddStep
  onWorldChange?:TOnWorldChange
}

export type TParkinCtx = {
  world:TWorldConfig
  resetParkin:() => void
  updateWorld: TOnWorldChange
}


const useInitParkin = (props:TWorldProvider) => {
  return useMemo(() => {
    const world = (props.world || { app: {}, $merge: {}, $alias: {} }) as TWorldConfig
    ife(async () => {
      await ParkinWorker.init(world, props.defs)
      onEmitEvent<TOnParkinInit>(ParkinInitEvt, {})
    })

    return world
  }, [])
}


export const WorldContext = createContext<TParkinCtx>({} as TParkinCtx)
export const useWorld = () => useContext(WorldContext)

export const WorldProvider = (props:TWorldProvider) => {
  const {
    children,
    onWorldChange
  } = props

  const initWorld = useInitParkin(props)
  const [world, setWorld] = useState<TWorldConfig>(initWorld)
  
  const updateWorld = useInline<TOnWorldChange>(async ({ world:updated, replace}) => {
    const world = await ParkinWorker.setWorld(updated, replace)
    onWorldChange?.({ world, replace })
    setWorld(world)
  })
  
  const resetParkin = useInline(() => ParkinWorker.reset())

  useOnEvent<TOnWorldUpdate>(UpdateWorldEvt, updateWorld)

  const parkinCtx:TParkinCtx = useMemo(() => ({
    world,
    updateWorld,
    resetParkin,
  }), [
    world,
    resetParkin,
    updateWorld,
  ])

  return (
    <WorldContext.Provider value={parkinCtx}>
      <MemoChildren children={children} />
    </WorldContext.Provider>
  )

}
