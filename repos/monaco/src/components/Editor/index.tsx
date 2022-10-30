import type { IMultiRefType, TMonacoEditor } from '../../types'

import './index.css'
import Editor from './Editor'
import { Loading } from '../Icons/Loading'
import { forwardRef, useEffect, useState } from 'react'

const useInitMonaco = () => {
  const [, setCount] = useState(0)

  useEffect(() => {
    ;(async () => {
      const { initMonaco } = await import('../../init')
      // Initialize monaco - update to pass in config object
      initMonaco()
    })()

    const interval = setInterval(() => {
      setCount(pre => pre + 1)
      if (window.monaco) clearInterval(interval)
    }, 100)

    return () => clearInterval(interval)
  }, [])
}

export const MonacoEditor = forwardRef<IMultiRefType, TMonacoEditor>((props, ref) => {
    useInitMonaco()
    const {
      Loading:LoadingComp=(<Loading />),
      ...editorProps
    } = props

    return window.monaco
      ? (<Editor {...editorProps} ref={ref} />)
      : (<div className='goblet-monaco-editor-loading'>{LoadingComp}</div>)
  }
)

MonacoEditor.displayName = 'MonacoEditorEntry'

export default MonacoEditor
