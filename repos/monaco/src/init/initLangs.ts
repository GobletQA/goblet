import { LANGS } from '../constants'
import type { TMonaco, TEditorConfig } from '../types'

const addExtraLib = async (config:TEditorConfig, monaco:TMonaco) => {
  
}

const registerLangs = async (config:TEditorConfig, monaco:TMonaco) => {
  const langs = [ ...LANGS, ...(config?.monaco?.languages || []) ] as string[]
  langs.forEach(lang => monaco.languages.register({ id: lang }))
}

const compilerOptions = {
  allowJs: true,
  allowNonTsExtensions: true,
  // for use of import React from 'react' rather than import * as React from 'react'
  allowSyntheticDefaultImports: true,
}

const setCompileOpts = (config:TEditorConfig, monaco:TMonaco) => {
  monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
    ...compilerOptions,
    ...config?.tsconfig?.compilerOptions
  })

  monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
    ...compilerOptions,
    ...config?.tsconfig?.compilerOptions
  })
}

const setLangDefaults = (config:TEditorConfig, monaco:TMonaco) => {
/**
 * Sync all the models to the worker eagerly.
 * This enables intelliSense for all files without needing an `addExtraLib` call.
 */
  monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true)
  monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true)
  monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: false,
    noSyntaxValidation: false,
  })
  
  monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
    validate: true,
  })

}

export const initLangs = async (config:TEditorConfig, monaco:TMonaco) => {
  setLangDefaults(config, monaco)
  setCompileOpts(config, monaco)
  addExtraLib(config, monaco)
  registerLangs(config, monaco)
}

