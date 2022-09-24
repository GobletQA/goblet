import type { TEditorConfig } from './types'

import { loadWASM } from 'onigasm'
import { PATHS } from './constants'
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

export const themes: {
  [key: string]: any
} = {}

export async function configTheme(name: string) {
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

async function addExtraLib() {
  let res = await (await fetch(`${PATHS.assets}@types/react/index.d.ts`)).text()
  window.monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
    allowJs: true,
    allowNonTsExtensions: true,
    // for use of import React from 'react' ranther than import * as React from 'react'
    allowSyntheticDefaultImports: true,
  })
  window.monaco.languages.typescript.javascriptDefaults.addExtraLib(
    res,
    'music:/node_modules/@types/react/index.d.ts'
  )
  window.monaco.languages.typescript.typescriptDefaults.addExtraLib(
    res,
    'music:/node_modules/@types/react/index.d.ts'
  )
  res = await (await fetch(`${PATHS.assets}@types/react/global.d.ts`)).text()
  window.monaco.languages.typescript.javascriptDefaults.addExtraLib(
    res,
    'music:/node_modules/%40types/react/global.d.ts'
  )
  window.monaco.languages.typescript.typescriptDefaults.addExtraLib(
    res,
    'music:/node_modules/%40types/react/global.d.ts'
  )
  res = await (await fetch(`${PATHS.assets}@types/react-dom/index.d.ts`)).text()
  window.monaco.languages.typescript.javascriptDefaults.addExtraLib(
    res,
    'music:/node_modules/@types/react-dom/index.d.ts'
  )
  window.monaco.languages.typescript.typescriptDefaults.addExtraLib(
    res,
    'music:/node_modules/@types/react-dom/index.d.ts'
  )
}


const initLangs = async () => {
  window.monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true)
  window.monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: true,
    noSyntaxValidation: true,
  })

  await loadWASM(`${PATHS.assets}onigasm.wasm`)
  configTheme('OneDarkPro')
  addExtraLib()
}

const registerLangs = () => {
  window.monaco.languages.register({ id: 'JavascriptReact' })
  window.monaco.languages.register({ id: 'TypescriptReact' })
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

const setupMonaco = () => {
  initLangs()
  registerLangs()
  const { grammars, registry } = initGrammars()

  setTimeout(() => wireTmGrammars(window.monaco, registry, grammars) , 3000)
}

export const initEditor = (config?:TEditorConfig) => {
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
      setupMonaco()
      clearInterval(interval)
    }
  }, 100)
}
