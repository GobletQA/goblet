import type { TPlayerTestEvent } from '@types'

import { EAstObject } from '@ltipton/parkin'

export const getTypeFromId = (event:TPlayerTestEvent) => {
  const [name, ...rest] = event?.id?.split(`-`)
  return name.startsWith(`spec`)
    ? EAstObject.step
    : rest.length > 1 ? EAstObject.scenario : EAstObject.feature
}
