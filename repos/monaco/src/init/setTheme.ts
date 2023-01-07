import type { TMonaco, TEditorThemes, TEditorTheme } from '../types'

import {
  getTheme,
  EThemeMode,
  setThemeVars,
  loadGobletTheme,
  EGobletThemeName,
} from '@gobletqa/components'

export const themes: TEditorThemes = {}

const importTheme = async (themeName:string, mode:string):Promise<TEditorTheme> => {
  let importedTheme
  try {
    const resp = await import(`../themes/${themeName}.json`)
    const { __esModule, ...theme } = resp
    importedTheme = theme
  }
  catch(err:any){
    console.error(err.message)
  }

  return importedTheme || await loadGobletTheme({ mode, context: `monaco`, loadVars: false })
}

const resolveTheme = async (name:string, mode:string) => {
  const theme = (name === EGobletThemeName.light || name === EGobletThemeName.dark)
    ? await loadGobletTheme({ mode, name, loadVars: false, context: `monaco` })
    : await importTheme(name, mode)

  if(!theme) return

  themes[name] = theme
  window.monaco.editor.defineTheme(name, theme)

  return theme
}

export const  setTheme = async (
  name?: string,
  themeObj?:TEditorTheme,
  monaco?:TMonaco,
) => {

  const mode = getTheme()?.palette?.mode || EThemeMode.light
  name = name || `Goblet-${mode}`

  const theme = themes[name as string]
    || themeObj
    || await resolveTheme(name, mode)

  if(!theme) return

  theme && setThemeVars(theme, `monaco`)
  monaco = monaco || window.monaco
  name && monaco.editor.setTheme(name)
}
