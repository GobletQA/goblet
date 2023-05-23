import type { TBuiltDeco, TPlayerTestEvent } from '@types'

import { getTypeFromId } from './getTypeFromId'
import { buildDecoration } from './buildDecoration'

export const buildDecorationFrom = <T=TBuiltDeco, A=any>(
  from:TPlayerTestEvent,
  event:TPlayerTestEvent
) => {
  const type = getTypeFromId(event)
  return buildDecoration<T, A>({
    type,
    event: from,
    testPath: event.testPath,
    description: event.description,
  })
}