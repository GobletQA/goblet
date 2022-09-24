import type { TFilelist } from '@gobletqa/monaco/types'
import ReactDOM from 'react-dom'
import { THEMES } from '@gobletqa/monaco/constants'
import MultiEditor from '../src/multi'
import { useCallback, useRef } from 'react'
import { createRoot } from 'react-dom/client'

const fileList: TFilelist = {
  '/file1.js': `console.log('file 1')`,
  '/file2.js': `const test = 'file 2'\nconsole.log(test)`,
  '/file3.ts': `const test = () => console.log('file 3')\ntest()`,
}

const App = () => {
  
  const editorRef = useRef<any>(null)

  const onThemeChange = (e: any) => {
    editorRef.current.setTheme(e.target.value)
  }

  const onPathChange = useCallback((key: string) => {
    console.log(key)
  }, [])

  const onValueChange = useCallback((value: string) => {
    console.log(value)
  }, [])

  const onFileChange = useCallback((file: string) => {
    console.log(file)
  }, [])

  return (
    <div>
      <div className="tool-bar" style={{ marginBottom: '20px' }} >
        <div style={{ width: "100%", marginBottom: '5px' }} >Tools</div>
        <div
          className="tools"
          style={{
            flex: 1,
            width: '100%',
            display: 'flex',
            columnGap: '10px',
          }}
        >
          <button
            onClick={() => console.log(editorRef.current)}
          >
            Log Editor
          </button>
          <button
            onClick={() => console.log(editorRef.current.getAllValue())}
          >
            Log Editor Files
          </button>
          <label>
            Set Theme
            <br/>
            <select name='theme' onChange={onThemeChange} defaultValue='OneDarkPro'>
              {THEMES.map(theme => (
                <option key={theme} value={theme}>
                  {theme}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div style={{ width: '800px', height: '600px' }}>
        <MultiEditor
          ref={editorRef}
          defaultFiles={fileList}
          onPathChange={onPathChange}
          onFileChange={onFileChange}
          onValueChange={onValueChange}
          options={{
            fontSize: 14,
            automaticLayout: true,
          }}
        />
      </div>
    </div>
  )
}

const root = createRoot(document.getElementById('root') as HTMLElement)
root.render(<App />)
