import type { TEditorConfig } from '../types'
import { PATHS } from '../constants'
import { Registry } from 'monaco-textmate'


const grammerMap: {
  [key: string]: string
} = {
  'source.ts': 'Typescript.tmLanguage.json',
  'source.js': 'Javascript.tmLanguage.json',
  'source.js.jsx': 'JavaScriptReact.tmLanguage.json',
  'source.ts.tsx': 'TypesSriptReact.tmLanguage.json',
  'source.css': 'css.tmLanguage.json',
  'text.html.basic': 'html.tmLanguage.json',
}


export const initGrammars = (config:TEditorConfig) => {
  const grammars = new Map()

  grammars.set('typescript', 'source.ts')
  grammars.set('javascript', 'source.js')
  grammars.set('JavascriptReact', 'source.js.jsx')
  grammars.set('TypescriptReact', 'source.ts.tsx')
  grammars.set('css', 'source.css')
  grammars.set('html', 'text.html.basic')

  const registry = new Registry({
    getGrammarDefinition: async scopeName => {
      const res = await (
        await fetch(`${PATHS.assets}Grammars/${grammerMap[scopeName]}`)
      ).text()
      return {
        format: 'json',
        content: res,
      }
    },
  })

  return { grammars, registry }
}