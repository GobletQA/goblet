import type {
  TRaceDecoCtx,
  TRaceDecorations,
  TRaceDecoProvider,
} from '@GBR/types'

import { MemoChildren } from '@gobletqa/components'
import { useRaceDecoHooks } from '@GBR/hooks/decorations/useRaceDecoHooks'
import { useGetDecoContext } from '@GBR/hooks/decorations/useGetDecoContext'
import {
  useMemo,
  useState,
  useContext,
  createContext,
} from 'react'

export const DecorationsContext = createContext<TRaceDecoCtx>({} as TRaceDecoCtx)
export const useDecorations = () => useContext(DecorationsContext)

/**
 * TODO: this is for testing only
 * Remove once decorations are completed
 */
const testDecorations = {
  [`/goblet/repos/lancetipton04/goblet/bdd/features/run-tests.feature`]: {
    [`/goblet/repos/lancetipton04/goblet/bdd/features/run-tests.feature`]: {
      type: `spin`,
      id: `/goblet/repos/lancetipton04/goblet/bdd/features/run-tests.feature`,
    }
  }
}

export const DecorationsProvider = (props:TRaceDecoProvider) => {
  const {
    decoRef,
    children,
  } = props

  const [decorations, setDecorations] = useState<TRaceDecorations>(testDecorations as TRaceDecorations)

  const {
    add,
    clear,
    update
  } = useRaceDecoHooks({
    decorations,
    setDecorations,
  })

  const decorationsCtx:TRaceDecoCtx = useMemo(() => ({
    add,
    clear,
    update,
    decorations,
    setDecorations,
  }), [
    add,
    clear,
    update,
    decorations
  ])

  useGetDecoContext({ decoRef, decorationsCtx })

  return (
    <DecorationsContext.Provider value={decorationsCtx}>
      <MemoChildren children={children} />
    </DecorationsContext.Provider>
  )

}
