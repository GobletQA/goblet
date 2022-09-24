
export const MONACO_URLS = {
  loader: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.30.1/min/vs/loader.min.js',
  vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.30.1/min/vs',
  prettier: {
    standalone: 'https://unpkg.com/prettier@2.5.1/standalone.js',
    babel: 'https://unpkg.com/prettier@2.5.1/parser-babel.js',
    html: 'https://unpkg.com/prettier@2.5.1/parser-html.js',
    postcss: 'https://unpkg.com/prettier@2.5.1/parser-postcss.js',
    typescript: 'https://unpkg.com/prettier@2.5.1/parser-typescript.js',
  },
}

const getAssetsPath = () => {
  let found = `/`
  // @ts-ignore
  try { found = ASSETS_PATH } catch(err){}

  return found
}

export const PATHS = {
  vs: 'vs/editor/editor.main',
  // @ts-ignore
  assets: getAssetsPath() as string
}

export const LANGS = [
  'JavascriptReact',
  'TypescriptReact'
]