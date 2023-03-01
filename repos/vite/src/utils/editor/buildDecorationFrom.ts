import type { TPlayerTestEvent } from '@types'

import { getTypeFromId } from './getTypeFromId'
import { buildDecoration } from './buildDecoration'

export const buildDecorationFrom = (
  from:TPlayerTestEvent,
  event:TPlayerTestEvent
) => {
  const type = getTypeFromId(event)
  return buildDecoration(from, type, event.description, event.testPath)
}