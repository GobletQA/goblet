import { EThemeType, TEditorTheme } from '@GBC/types'
import { setThemeVars, getTheme } from './theme'


export const loadGobletTheme = async (
  type?:string,
  context?:string,
  loadVars:boolean=true
) => {
  try {
    type = type || getTheme()?.palette?.mode

    const mod = type === EThemeType.light
      ? await import(`./themes/Goblet-light.json`)
      : await import(`./themes/Goblet-dark.json`)

    const theme = mod?.default as TEditorTheme
    loadVars && setThemeVars(theme, context)

    return theme
  }
  catch(err:any){
    console.error(err.message)
    return false
  }
}
