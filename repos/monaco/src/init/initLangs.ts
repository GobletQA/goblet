import { loadWASM } from 'onigasm'
import { PATHS } from '@constants'
import type { TEditorConfig } from '@types'
import { setTheme } from './setTheme'

const addExtraLib = async () => {
  let res = await (await fetch(`${PATHS.assets}@types/react/index.d.ts`)).text()
  window.monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
    allowJs: true,
    allowNonTsExtensions: true,
    // for use of import React from 'react' ranther than import * as React from 'react'
    allowSyntheticDefaultImports: true,
  })
  window.monaco.languages.typescript.javascriptDefaults.addExtraLib(
    res,
    'goblet:/node_modules/@types/react/index.d.ts'
  )
  window.monaco.languages.typescript.typescriptDefaults.addExtraLib(
    res,
    'goblet:/node_modules/@types/react/index.d.ts'
  )
  res = await (await fetch(`${PATHS.assets}@types/react/global.d.ts`)).text()
  window.monaco.languages.typescript.javascriptDefaults.addExtraLib(
    res,
    'goblet:/node_modules/%40types/react/global.d.ts'
  )
  window.monaco.languages.typescript.typescriptDefaults.addExtraLib(
    res,
    'goblet:/node_modules/%40types/react/global.d.ts'
  )
  res = await (await fetch(`${PATHS.assets}@types/react-dom/index.d.ts`)).text()
  window.monaco.languages.typescript.javascriptDefaults.addExtraLib(
    res,
    'goblet:/node_modules/@types/react-dom/index.d.ts'
  )
  window.monaco.languages.typescript.typescriptDefaults.addExtraLib(
    res,
    'goblet:/node_modules/@types/react-dom/index.d.ts'
  )
}

const registerLangs = () => {
  window.monaco.languages.register({ id: 'JavascriptReact' })
  window.monaco.languages.register({ id: 'TypescriptReact' })
}

export const initLangs = async (config:TEditorConfig) => {

  window.monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true)
  window.monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: true,
    noSyntaxValidation: true,
  })

  await loadWASM(`${PATHS.assets}onigasm.wasm`)
  setTheme(config?.editor?.theme || 'OneDarkPro')
  addExtraLib()
  registerLangs()
}
