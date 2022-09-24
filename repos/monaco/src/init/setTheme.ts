import type { TEditorThemes, TEditorTheme } from '../types'
import { PATHS } from '../constants'


export const themes: TEditorThemes = {}

export const  setTheme = async (name: string, themeObj?:TEditorTheme) => {
  let theme = themes[name] || themeObj
  if (!theme) {
    theme = {} as TEditorTheme
    themes[name] = theme
    window.monaco.editor.defineTheme(name, theme)
  }

  const prefix = '--monaco-'

  Object.keys(theme.colors).forEach(v => {
    document.documentElement.style.setProperty(
      `${prefix}${v.replace('.', '-')}`,
      theme.colors[v] || themes.OneDarkPro.colors[v] || 'rgba(0, 0, 0, 0)'
    )
  })

  window.monaco.editor.setTheme(name)
}
