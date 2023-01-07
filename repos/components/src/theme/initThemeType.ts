import { StorageKeys  } from '@GBC/constants'
import { EThemeMode } from '@gobletqa/components'

let ThemeType = window.localStorage.getItem(StorageKeys.THEME_TYPE) as EThemeMode

try {
  if(!ThemeType)
    ThemeType = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? EThemeMode.dark
      : EThemeMode.light
}
catch(err){
  ThemeType = EThemeMode.light
}

export {
  ThemeType
}