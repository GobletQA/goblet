import { EGobletThemeName, EThemeMode, TEditorTheme } from '@GBC/types'
import { setThemeVars, getTheme } from './theme'

export type TLoadGobletTheme = {
  name?:string
  context?:string
  mode?:EThemeMode
  loadVars?:boolean
}

export const loadGobletTheme = async ({
  mode,
  name,
  context,
  loadVars=true
}:TLoadGobletTheme):Promise<TEditorTheme|false> => {
  try {
    mode = mode || getTheme()?.palette?.mode as EThemeMode

    const mod = name === EGobletThemeName.dark || (!name && mode === EThemeMode.dark)
      ? await import('./themes/Goblet-dark')
      : await import('./themes/Goblet-light')

    const theme = mod?.default as TEditorTheme
    loadVars && setThemeVars(theme, context)

    return theme
  }
  catch(err:any){
    console.error(err.message)
    return false
  }
}
