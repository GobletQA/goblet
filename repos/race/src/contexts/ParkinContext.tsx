import type { TStepDefs, TWorldConfig, IParkin } from '../types'

// FUCK TYPESCRIPT!!!
// @ts-ignore
import { Parkin } from '@ltipton/parkin'
// FUCK TYPESCRIPT!!!
import { emptyObj, deepMerge } from '@keg-hub/jsutils'
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
  defs?:TStepDefs
  world?:TWorldConfig
}

export type TUpdateWorld = (updated:TWorldConfig, replace:boolean) => void
export type TParkinCtx = {
  parkin:IParkin
  world:TWorldConfig
  updateWorld: TUpdateWorld
}

export const ParkinContext = createContext<TParkinCtx>({} as TParkinCtx)
export const useParkin = () => useContext(ParkinContext)

export const ParkinProvider = (props:TParkinProvider) => {
  const { children, defs } = props

  const [parkin, setParkin] = useState<IParkin>(new Parkin(props.world || {}, defs) as unknown as IParkin)
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
