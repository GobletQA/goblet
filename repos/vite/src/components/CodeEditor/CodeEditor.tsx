import { useState, useCallback, useRef, useEffect } from 'react'
// import { MultiEditor } from 'yuzai-base-editor'
import { MultiEditor, initMonaco } from '@gobletqa/monaco'

export type TCodeEditorProps = {
  
}

const fileList:Record<string, string> = {
  '/file1.js': `console.log('file 1')`,
  'file2.js': `const test = 'file 2'\nconsole.log(test)`,
  'file3.ts': `const test = () => console.log('file 3')\ntest()`
}

export const CodeEditor = (props:TCodeEditorProps) => {
  const [files, setFiles] = useState<any>(fileList)
  const editorRef = useRef<any>(null)

  const onPathChange = useCallback((key: string) => {
    console.log(`------- path -------`)
    console.log(key)
  }, [])

  const onValueChange = useCallback((value: any) => {
    console.log(`------- value -------`)
    console.log(value)
  }, [])

  const onFileChange = useCallback((file: any) => {
    console.log(`------- file -------`)
    console.log(file)
  }, [])

  useEffect(() => initMonaco(), [])

  return (
    <MultiEditor
      ref={editorRef}
      // path={path}
      // value={value}
      defaultFiles={files}
      onPathChange={onPathChange}
      onValueChange={onValueChange}
      onFileChange={onFileChange}
      options={{
        fontSize: 14,
        automaticLayout: true,
      }}
    />
  )
  
}