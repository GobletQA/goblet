# Goblet Monaco

## Install

```
yarn add @gobletqa/monaco
```

### Use

```js
import { useState, useCallback, useRef } from 'react'
import { MultiEditor } from '@gobletqa/monaco'

const fileList: Record<string, string> = {
  '/file1.js': `console.log('file 1')`,
  '/file2.js': `const test = 'file 2'\nconsole.log(test)`,
  '/file3.ts': `const test = () => console.log('file 3')\ntest()`,
}

export const EditorComponent = (props: Record<any, any>) => {
  const [files, setFiles] = useState <any>(fileList)
  const editorRef = useRef <any>(null)

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
    <MultiEditor
      ref={editorRef}
      defaultFiles={files}
      onPathChange={onPathChange}
      onFileChange={onFileChange}
      onValueChange={onValueChange}
      options={{
        fontSize: 14,
        automaticLayout: true,
      }}
    />
  )
}
```
