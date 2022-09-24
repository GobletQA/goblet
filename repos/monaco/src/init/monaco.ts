import type { TEditorConfig } from '../types'

import { PATHS } from '../constants'
import { initLangs } from './initLangs'
import { Registry } from 'monaco-textmate'
import { wireTmGrammars } from 'monaco-editor-textmate'
declare type monacoType = typeof import('monaco-editor')

declare global {
  interface Window {
    monaco: monacoType
    define: any
    prettier: any
    prettierPlugins: any
    require: any
  }
}

let __INIT_CALLED = false

function loadScript(url: string, cb: () => void) {
  const script = document.createElement('script')
  script.src = url
  document.getElementsByTagName('body')[0].appendChild(script)
  script.onload = cb
}

// function loadCode(code: string) {
//     const script = document.createElement('script');
//     script.type = ' text/javascript';
//     script.appendChild(document.createTextNode(code));
//     document.getElementsByTagName('body')[0].appendChild(script);
// }

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


const initGrammars = () => {
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

const setupMonaco = (config:TEditorConfig) => {
  initLangs(config)
  const { grammars, registry } = initGrammars()

  setTimeout(() => wireTmGrammars(window.monaco, registry, grammars) , 3000)
}

export const initMonaco = (config:TEditorConfig={} as TEditorConfig) => {
  if (__INIT_CALLED) return
  __INIT_CALLED = true

  loadScript(
    'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.30.1/min/vs/loader.min.js',
    () => {
      window.require.config({
        paths: {
          vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.30.1/min/vs',
        },
      })

      window.require(['vs/editor/editor.main'], function () {})
      window.define(
        'prettier',
        [
          'https://unpkg.com/prettier@2.5.1/standalone.js',
          'https://unpkg.com/prettier@2.5.1/parser-babel.js',
          'https://unpkg.com/prettier@2.5.1/parser-html.js',
          'https://unpkg.com/prettier@2.5.1/parser-postcss.js',
          'https://unpkg.com/prettier@2.5.1/parser-typescript.js',
        ],
        (prettier: any, ...args: any[]) => {
          const prettierPlugins = {
            babel: args[0],
            html: args[1],
            postcss: args[2],
            typescript: args[3],
          }
          return {
            prettier,
            prettierPlugins,
          }
        }
      )
    }
  )
  const interval = setInterval(() => {
    if (window.monaco) {
      setupMonaco(config)
      clearInterval(interval)
    }
  }, 100)
}
