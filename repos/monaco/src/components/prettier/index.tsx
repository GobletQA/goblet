import { useEffect } from 'react'
import PrettierIcon from '../Icons/Prettier'
import './index.css'

const Prettier = (props: any) => {
  useEffect(() => {
    async function loadPrettier() {
      function provideDocumentFormattingEdits(model: any) {
        const p = window.require('prettier')
        if (!p.prettier) return
        const text = p.prettier.format(model.getValue(), {
          filepath: model.uri.path,
          plugins: p.prettierPlugins,
          singleQuote: true,
          tabWidth: 4,
        })

        return [
          {
            range: model.getFullModelRange(),
            text,
          },
        ]
      }
      window.monaco.languages.registerDocumentFormattingEditProvider('javascript', {
        provideDocumentFormattingEdits,
      })
      window.monaco.languages.registerDocumentFormattingEditProvider('typescript', {
        provideDocumentFormattingEdits,
      })
      setTimeout(() => {
        window.monaco.languages.registerDocumentFormattingEditProvider('html', {
          provideDocumentFormattingEdits,
        })
      }, 3000)
      window.monaco.languages.registerDocumentFormattingEditProvider('css', {
        provideDocumentFormattingEdits,
      })
      window.monaco.languages.registerDocumentFormattingEditProvider('less', {
        provideDocumentFormattingEdits,
      })
    }
    loadPrettier()
  }, [])

  return (
    <div {...props}>
      <PrettierIcon className='goblet-editor-prettier-icon' />
    </div>
  )
}

export default Prettier
