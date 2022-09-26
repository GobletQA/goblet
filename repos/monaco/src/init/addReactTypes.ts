// Don't need this in goblet, but keeping as may need it in other places

import type { TEditorConfig } from '../types'

export const addReactTypes = async (config:TEditorConfig) => {
  // @ts-ignore
  const { default:reactTypes} = await import('!raw-loader!../vendor/react/react/index.d.ts')
  window.monaco.languages.typescript.javascriptDefaults.addExtraLib(
    reactTypes,
    'goblet:/node_modules/@gobletqa/monaco/types/react/index.d.ts'
  )
  window.monaco.languages.typescript.typescriptDefaults.addExtraLib(
    reactTypes,
    'goblet:/node_modules/@gobletqa/monaco/types/react/index.d.ts'
  )

// @ts-ignore
  const { default: reactGlobalTypes} = await import('!raw-loader!../vendor/react/react/global.d.ts')
  window.monaco.languages.typescript.javascriptDefaults.addExtraLib(
    reactGlobalTypes,
    'goblet:/node_modules/%40types/react/global.d.ts'
  )
  window.monaco.languages.typescript.typescriptDefaults.addExtraLib(
    reactGlobalTypes,
    'goblet:/node_modules/%40types/react/global.d.ts'
  )

  // @ts-ignore
  const { default:reactDomTypes } = await import('!raw-loader!../vendor/react/react-dom/index.d.ts')
  window.monaco.languages.typescript.javascriptDefaults.addExtraLib(
    reactDomTypes,
    'goblet:/node_modules/@gobletqa/monaco/types/react-dom/index.d.ts'
  )
  window.monaco.languages.typescript.typescriptDefaults.addExtraLib(
    reactDomTypes,
    'goblet:/node_modules/@gobletqa/monaco/types/react-dom/index.d.ts'
  )
}
