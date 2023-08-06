// Don't need this in goblet, but keeping as may need it in other places

import type { TEditorConfig, TMonaco } from '../types'


export const addGobletTypes = async (config:TEditorConfig, monaco:TMonaco) => {
  // @ts-ignore
  const { default:gobletTypes } = await import('../vendor/goblet/index.d.ts?raw')
  window.monaco.languages.typescript.javascriptDefaults.addExtraLib(
    gobletTypes,
    'file:///node_modules/@types/goblet/index.d.ts'
  )
  window.monaco.languages.typescript.typescriptDefaults.addExtraLib(
    gobletTypes,
    'file:///node_modules/@types/goblet/index.d.ts'
  )

}
