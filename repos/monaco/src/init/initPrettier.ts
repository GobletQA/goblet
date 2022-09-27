import type { TEditorConfig } from '../types'

export const initPrettier = (config:TEditorConfig) => {
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