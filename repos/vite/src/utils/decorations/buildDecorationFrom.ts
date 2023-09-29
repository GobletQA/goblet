import type { TBuiltDeco, TPlayerTestEvent } from '@types'

import { EEditorType } from '@types'
import { getTypeFromId } from './getTypeFromId'
import { buildDecoration } from './buildDecoration'

export const buildDecorationFrom = <T=TBuiltDeco, A=any>(
  from:TPlayerTestEvent,
  event:TPlayerTestEvent,
  editor:EEditorType
) => {

  const type = event.eventParent || getTypeFromId(event)

  return buildDecoration<T, A>({
    type,
    editor,
    event: from,
    testPath: event.testPath,
    uuid: event?.metaData?.uuid,
    description: event?.metaData?.[type] || event.description,
  })
}