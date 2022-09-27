import type { TEditorConfig } from '../types'

import './services'
import { setTheme } from './setTheme'
import { initLangs } from './initLangs'
import { initPrettier } from './initPrettier'
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


const initTheme = (config:TEditorConfig) => {
  config?.theme?.name
    ? setTheme(config?.theme?.name, config?.theme?.theme)
    : setTheme('OneDarkPro')
}

const setupMonaco = (config:TEditorConfig) => {
  initLangs(config)
  initTheme(config)
  // const { grammars, registry } = initGrammars(config)
  // setTimeout(() => wireTmGrammars(window.monaco, registry, grammars) , 3000)
}

const loadMonaco = async (config:TEditorConfig) => {
  window.monaco = await import('monaco-editor')
  setupMonaco(config)
}


export const initMonaco = (config:TEditorConfig={} as TEditorConfig) => {
  !__INIT_CALLED && loadMonaco(config)
  __INIT_CALLED = true
}
