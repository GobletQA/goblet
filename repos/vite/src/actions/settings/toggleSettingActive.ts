import type { TSettingAct } from '@types'
import { settingsDispatch } from '@store'

export const toggleSettingActive = (props:TSettingAct) => {
  const { setting, data } = props
  settingsDispatch.toggleActive({ setting, data })
}