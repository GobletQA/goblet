import type { OpenFileTreeEvent } from '@types'

import { exists } from '@keg-hub/jsutils'
import { MonacoEditor } from '@gobletqa/monaco'
import { useState, useCallback, useRef, useEffect } from 'react'

import { OpenFileTreeEvt } from '@constants'
import { EE } from '@gobletqa/shared/libs/eventEmitter'

export type TCodeEditorProps = {
  
}

const fileList:Record<string, string> = {
  '/select-strategy.feature': `Feature: Strategy Overview
    As a user of the strategy application with at least one strategy created
    I want to see an overview of the strategy when I click into it
    So that I can easily identify what part of it I want to work on

    Example:
        Given I use the saved page cookie
        Given I navigate to "$world.app.url"
        Given I click "$$firstStrategy"
        I wait for "$$inviteBtn"
`,
  '/remove-strategy.feature': ``,
  '/goblet.config.ts': `const test = () => console.log('file 3')\ntest()`
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

  useEffect(() => {
    EE.on<OpenFileTreeEvent>(OpenFileTreeEvt, ({ size }) => {
      exists(size) && editorRef?.current?.resizeFileTree?.(size)
    }, `${OpenFileTreeEvt}-code-editor`)

    return () => {
      EE.off<OpenFileTreeEvent>(OpenFileTreeEvt, `${OpenFileTreeEvt}-code-editor`)
    }
  }, [])

  return (
    <MonacoEditor
      ref={editorRef}
      // path={path}
      // value={value}
      defaultFiles={files}
      initialFileTreeWidth={0}
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