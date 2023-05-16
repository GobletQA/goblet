import type { TUpdateSettingEvt, TSettingPayload } from '@GBR/types'

import { UpdateSettingContextEvt } from '@GBR/constants'
import { EE } from '@gobletqa/shared/libs/eventEmitter'

export const settingChange = (payload:TSettingPayload) => {
  EE.emit<TUpdateSettingEvt>(UpdateSettingContextEvt, { payload })
}