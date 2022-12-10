import type { TSetting } from '@types'
import { ResetAllGroupSetting } from '@constants'
import { settingsDispatch } from '@store'

export const resetSetting = async (setting:TSetting) => {
  const { group, key } = setting

  key === ResetAllGroupSetting
    ? settingsDispatch.resetGroup(group)
    : settingsDispatch.reset({ setting: `${group}.${key.replace('.', '-')}`, data: setting })

}
