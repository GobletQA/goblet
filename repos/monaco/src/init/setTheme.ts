import type { TMonaco, TEditorThemes, TEditorTheme } from '../types'

import {
  getTheme,
  EThemeType,
  setThemeVars,
  loadGobletTheme
} from '@gobletqa/components'

export const themes: TEditorThemes = {}

const importTheme = async (themeName:string, mode:string) => {
  let importedTheme
  try {
    const resp = await import(`../themes/${themeName}.json`)
    const { __esModule, ...theme } = resp
    importedTheme = theme
  }
  catch(err:any){
    console.error(err.message)
  }

  return importedTheme || await loadGobletTheme(mode, `monaco`, false)
}

const resolveTheme = async (name:string, mode:string) => {
  const theme = (name === `Goblet-light` || name === `Goblet-dark`)
    ? await loadGobletTheme(mode, `monaco`, false) as TEditorTheme
    : await importTheme(name, mode) as TEditorTheme

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

  const mode = getTheme()?.palette?.mode || EThemeType.light
  name = name || `Goblet-${mode}`

  const theme = themes[name as string]
    || themeObj
    || await resolveTheme(name, mode)

  if(!theme) return

  theme && setThemeVars(theme, `monaco`)
  monaco = monaco || window.monaco
  name && monaco.editor.setTheme(name)
}
