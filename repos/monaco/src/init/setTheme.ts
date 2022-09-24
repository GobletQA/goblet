import type { TEditorTheme } from '@types'
import { PATHS } from '@constants'


export const themes: TEditorTheme = {}

export const  setTheme = async (name: string) => {
  let theme = themes[name]
  if (!theme) {
    theme = JSON.parse(await (await fetch(`${PATHS.assets}themes/${name}.json`)).text())
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
