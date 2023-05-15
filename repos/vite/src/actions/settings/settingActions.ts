import type { TSettingAct } from '@types'

import { toggleSidebarLocked } from '../nav/toggleSidebarLocked'
import { toggleMultiFeatsErr } from '../features/local/toggleMultiFeatsErr'
import { SettingMultiFeatsErr, SettingSidebarLocked } from '@constants/settings'

export const settingActions:Record<string, (payload:TSettingAct) => void> = {
  [SettingMultiFeatsErr]: (payload:TSettingAct) => toggleMultiFeatsErr(payload.value),
  [SettingSidebarLocked]: (payload:TSettingAct) => toggleSidebarLocked(payload.value),
  // Add other setting actions here as needed
}
