import type { TMonaco, TEditorConfig } from '../types'

import './services'
import { setTheme } from './setTheme'
import { initLangs } from './initLangs'

// import { initPrettier } from './initPrettier'
// import { initGrammars } from './initGrammars'
// import { wireTmGrammars } from 'monaco-editor-textmate'

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


const initTheme = (config:TEditorConfig, monaco:TMonaco) => {
  config?.theme?.name
    ? setTheme(config?.theme?.name, config?.theme?.theme, monaco)
    : setTheme(undefined, undefined, monaco)
}

const initGherkin = async (config:TEditorConfig, monaco:TMonaco) => {
  if(!config?.gherkin) return

  const { setGherkin } = await import('./setGherkin')
  setGherkin(config, monaco)
}

const setupMonaco = async (config:TEditorConfig, monaco:TMonaco) => {
  await initGherkin(config, monaco)
  initLangs(config, monaco)
  initTheme(config, monaco)
  // TODO: add grammar workers - used by linter
  // const { grammars, registry } = initGrammars(config)
  // setTimeout(() => wireTmGrammars(window.monaco, registry, grammars) , 3000)
}

const loadMonaco = async (config:TEditorConfig) => {
  window.monaco = await import('monaco-editor') as TMonaco
  setupMonaco(config, window.monaco)
}


export const initMonaco = (config:TEditorConfig={} as TEditorConfig) => {
  !__INIT_CALLED && loadMonaco(config)
  __INIT_CALLED = true
}
