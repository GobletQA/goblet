import { LANGS } from '../constants'
import type { TEditorConfig } from '../types'

const addExtraLib = async (config:TEditorConfig) => {
  
}

const registerLangs = (config:TEditorConfig) => {
  const langs = [ ...LANGS, ...(config?.monaco?.languages || []) ] as string[]
  langs.forEach(lang => window.monaco.languages.register({ id: lang }))
}

const setCompileOpts = (config:TEditorConfig) => {
  window.monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
    allowJs: true,
    allowNonTsExtensions: true,
    // for use of import React from 'react' rather than import * as React from 'react'
    allowSyntheticDefaultImports: true,
    ...config?.tsconfig?.compilerOptions
  })
}

const setLangDefaults = (config:TEditorConfig) => {
/**
 * Sync all the models to the worker eagerly.
 * This enables intelliSense for all files without needing an `addExtraLib` call.
 */
  window.monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true)
  window.monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true)
  window.monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: true,
    noSyntaxValidation: true,
  })
}

export const initLangs = async (config:TEditorConfig) => {
  setLangDefaults(config)
  setCompileOpts(config)
  addExtraLib(config)
  registerLangs(config)
}
