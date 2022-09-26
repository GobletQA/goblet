import type { TEditorConfig } from '../types'


import { setTheme } from './setTheme'
import { initLangs } from './initLangs'
import { initGrammars } from './initGrammars'
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

const initTheme = (config:TEditorConfig) => {
  config?.theme?.name
    ? setTheme(config?.theme?.name, config?.theme?.theme)
    : setTheme('OneDarkPro')
}

const setupMonaco = (config:TEditorConfig) => {
  initLangs(config)
  initTheme(config)
  
  const { grammars, registry } = initGrammars(config)
  setTimeout(() => wireTmGrammars(window.monaco, registry, grammars) , 3000)
}

const monacoLoadCb = (config:TEditorConfig) => {
  return () => {
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
}

export const initMonaco = (config:TEditorConfig={} as TEditorConfig) => {
  if (__INIT_CALLED) return
  __INIT_CALLED = true

  loadScript(
    'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.30.1/min/vs/loader.min.js',
    monacoLoadCb(config)
  )

  const interval = setInterval(() => {
    if (window.monaco) {
      setupMonaco(config)
      clearInterval(interval)
    }
  }, 100)
}
