import type {
  TWorldConfig,
  TRegisterStepsList,
} from '@ltipton/parkin'


import { Parkin } from '@ltipton/parkin'
import { deepMerge } from '@keg-hub/jsutils'
import { useEffectOnce, MemoChildren, useInline } from '@gobletqa/components'
import {
  useRef,
  useMemo,
  useState,
  useEffect,
  useContext,
  createContext,
} from 'react'

export type TParkinProvider = {
  children:any
  world?:TWorldConfig
  defs?:TRegisterStepsList
}

export type TUpdateWorld = (updated:TWorldConfig, replace:boolean) => void
export type TParkinCtx = {
  parkin:Parkin
  world:TWorldConfig
  updateWorld: TUpdateWorld
}

export const ParkinContext = createContext<TParkinCtx>({} as TParkinCtx)
export const useParkin = () => useContext(ParkinContext)

export const ParkinProvider = (props:TParkinProvider) => {
  const { children, defs } = props

  const [parkin, setParkin] = useState<Parkin>(
    new Parkin(props.world || {} as TWorldConfig,
    defs
  ) as Parkin)
  const [world, setWorld] = useState<TWorldConfig>(parkin.world)

  const updateWorld = useInline<TUpdateWorld>((updated:TWorldConfig, replace:boolean) => {
    parkin.world = replace ? updated : deepMerge(parkin.world, updated)
    setWorld(parkin.world)
  })

  useEffectOnce(() => {
    return () => {
      parkin?.steps?.clear?.()
      setParkin(undefined as any)
    }
  })

  const parkinCtx:TParkinCtx = useMemo(() => ({
    world,
    parkin,
    updateWorld
  }), [
    parkin,
    world,
    updateWorld
  ])

  return (
    <ParkinContext.Provider value={parkinCtx}>
      <MemoChildren children={children} />
    </ParkinContext.Provider>
  )

}
