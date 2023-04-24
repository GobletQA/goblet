import type { TOnWorldUpdate } from '@GBR/types'

import { onEmitEvent } from '@gobletqa/components'
import { UpdateWorldEvt } from '@GBR/constants/events'

export const updateWorld = (data:TOnWorldUpdate) => {
  onEmitEvent<TOnWorldUpdate>(UpdateWorldEvt, data)
}