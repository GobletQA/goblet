import type { MutableRefObject } from 'react'
import type {
  TRaceDecoRef,
  TRaceDecoCtx,
  TRaceDecoFns,
  TRaceDecoAdd,
  TRaceDecoClear,
  TSetDecorations,
  TRaceDecorations,
  TRaceDecoUpdate,
} from '@GBR/types'


import { useInline } from '@gobletqa/components'

export type THDecoration = {
  decorations:TRaceDecorations
  setDecorations:TSetDecorations
}

export const useRaceDecoHooks = (props:THDecoration) => {
  const {
    decorations,
    setDecorations
  } = props


  const addDecoration = useInline<TRaceDecoAdd>((location, decoration, meta) => {
    console.log(`------- location -------`)
    console.log(location)

    console.log(`------- decoration -------`)
    console.log(decoration)
    
    // const decos = {...decorations}
    // decos[location] = {...decos[location], [decoration.id]: decoration}

    // setDecorations(decos)
  })

  const clearDecorations = useInline<TRaceDecoClear>((location:string) => {
    // if(!decorations[location])
    //   return console.warn(`[Race Decos] Can not clear decorations. They do not exist for ${location}`)

    // const decos = {...decorations}
    // delete decos[location]

    // setDecorations(decos)
  })

  const updateDecorations = useInline<TRaceDecoUpdate>((location, decoration, meta) => {
    console.log(`------- location -------`)
    console.log(location)
    console.log(`------- decoration -------`)
    console.log(decoration)
    // const decos = {...decorations}
    // decos[location] = {...decos[location], ...decoration}

    // setDecorations(decos)
  })


  return {
    add: addDecoration,
    clear: clearDecorations,
    update: updateDecorations,
  } as TRaceDecoFns

}