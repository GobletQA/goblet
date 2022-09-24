import { loadWASM } from 'onigasm'
import { PATHS, LANGS } from '../constants'
import type { TEditorConfig } from '../types'
import { setTheme } from './setTheme'


const addExtraLib = async (config:TEditorConfig) => {
  let res = await (await fetch(`${PATHS.assets}@gobletqa/monaco/types/react/index.d.ts`)).text()
  window.monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
    allowJs: true,
    allowNonTsExtensions: true,
    // for use of import React from 'react' ranther than import * as React from 'react'
    allowSyntheticDefaultImports: true,
  })
  window.monaco.languages.typescript.javascriptDefaults.addExtraLib(
    res,
    'goblet:/node_modules/@gobletqa/monaco/types/react/index.d.ts'
  )
  window.monaco.languages.typescript.typescriptDefaults.addExtraLib(
    res,
    'goblet:/node_modules/@gobletqa/monaco/types/react/index.d.ts'
  )
  res = await (await fetch(`${PATHS.assets}@gobletqa/monaco/types/react/global.d.ts`)).text()
  window.monaco.languages.typescript.javascriptDefaults.addExtraLib(
    res,
    'goblet:/node_modules/%40types/react/global.d.ts'
  )
  window.monaco.languages.typescript.typescriptDefaults.addExtraLib(
    res,
    'goblet:/node_modules/%40types/react/global.d.ts'
  )
  res = await (await fetch(`${PATHS.assets}@gobletqa/monaco/types/react-dom/index.d.ts`)).text()
  window.monaco.languages.typescript.javascriptDefaults.addExtraLib(
    res,
    'goblet:/node_modules/@gobletqa/monaco/types/react-dom/index.d.ts'
  )
  window.monaco.languages.typescript.typescriptDefaults.addExtraLib(
    res,
    'goblet:/node_modules/@gobletqa/monaco/types/react-dom/index.d.ts'
  )
}

const registerLangs = (config:TEditorConfig) => {
  const langs = [ ...LANGS, (config?.monaco?.languages || []) ] as string[]
  langs.forEach(lang => window.monaco.languages.register({ id: lang }))
}

export const initLangs = async (config:TEditorConfig) => {

  window.monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true)
  window.monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: true,
    noSyntaxValidation: true,
  })

  await loadWASM(`${PATHS.assets}onigasm.wasm`)
  config?.theme?.name
    && setTheme(config?.theme?.name, config?.theme?.theme)

  addExtraLib(config)
  registerLangs(config)
}
