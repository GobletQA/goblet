import { StorageKeys  } from '@GBC/constants'
import { EThemeType } from '@gobletqa/components'

let ThemeType = window.localStorage.getItem(StorageKeys.THEME_TYPE) as EThemeType

try {
  if(!ThemeType)
    ThemeType = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? EThemeType.dark
      : EThemeType.light
}
catch(err){
  ThemeType = EThemeType.light
}

export {
  ThemeType
}