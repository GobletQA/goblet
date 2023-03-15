import type { TRaceBackgroundParent, TRaceBackground } from '@GBR/types'


export type TFoundBackground = {
  background?:TRaceBackground
}

export const findBackground = (
  parent:TRaceBackgroundParent,
) => {
  // TODO find background from ID looking on features and feature.rules

  const background = parent?.background
  return {
    background,
  } as TFoundBackground
}