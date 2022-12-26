import { EThemeType } from '@types'

let ThemeType:EThemeType
try {
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