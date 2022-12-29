import type { SyntheticEvent } from 'react'

export type TTreeToggle = (event: SyntheticEvent, nodeIds: string[]) => void
export type TTreeSelect = (event: SyntheticEvent, nodeIds: string | string[]) => void