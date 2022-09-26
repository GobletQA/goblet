import type { TEditorThemes, TEditorTheme } from '../types'

export const themes: TEditorThemes = {}

const importTheme = async (themeName:string) => {
  try {
    const { __esModule, ...theme } = await import(`../themes/${themeName}.json`)
    return theme
  }
  catch(err:any){
    console.error(err.message)
    return false
  }
}


export const  setTheme = async (name: string, themeObj?:TEditorTheme) => {
  let theme = themes[name] || themeObj
  if (!theme) {
    theme = await importTheme(name) as TEditorTheme
    if(!theme) return

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
