import type { TSettingAct } from '@types'
import { settingsDispatch } from '@store'

export const toggleSettingActive = (props:TSettingAct) => {
  const { setting } = props
  settingsDispatch.toggleActive({ setting })
}