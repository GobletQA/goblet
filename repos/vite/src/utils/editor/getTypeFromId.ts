import type { TPlayerTestEvent } from '@types'
import { EAstObjects } from '@types'

export const getTypeFromId = (event:TPlayerTestEvent) => {
  const [name, ...rest] = event?.id?.split(`-`)
  return name.startsWith(`spec`)
    ? EAstObjects.step
    : rest.length > 1 ? EAstObjects.scenario : EAstObjects.feature
}
