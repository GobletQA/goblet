import type { TEditorConfig } from '../types'
import { Registry } from 'monaco-textmate'

const grammerMap: {
  [key: string]: string
} = {
  'source.ts': 'Typescript.tmLanguage',
  'source.js': 'Javascript.tmLanguage',
  'source.js.jsx': 'JavaScriptReact.tmLanguage',
  'source.ts.tsx': 'TypesSriptReact.tmLanguage',
  'source.css': 'css.tmLanguage',
  'text.html.basic': 'html.tmLanguage',
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
      const {default:content} = await import(`../vendor/Grammars/${grammerMap[scopeName]}.txt?raw`)
      return {
        content,
        format: 'json',
      }
    },
  })

  return { grammars, registry }
}