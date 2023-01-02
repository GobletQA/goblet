import type { Dispatch, SetStateAction } from 'react'
import type { TRaceFeature } from './features.types'

export type TEditing = {
  [K in keyof TRaceFeature]?: TRaceFeature[K]
}

export type TSetEditing = Dispatch<SetStateAction<TEditing>>


export type TEditingProps = {
  editing: TEditing
  setEditing: TSetEditing
}