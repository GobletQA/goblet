import type { TEditorConfig, IMultiRefType, TMonacoEditor } from '../../types'

import Editor from './Editor'
import { Loading } from '../Icons/Loading'
import { forwardRef, useEffect, useState } from 'react'

const useInitMonaco = (
  config?:TEditorConfig,
  onMonacoLoaded?:TMonacoEditor[`onMonacoLoaded`]
) => {
  const [, setCount] = useState(0)

  useEffect(() => {
    ;(async () => {
      const { initMonaco } = await import('../../init')
      // Initialize monaco - update to pass in config object
      initMonaco(config)
    })()

    const interval = setInterval(() => {
      setCount(pre => pre + 1)
      if (window.monaco){
        clearInterval(interval)
        onMonacoLoaded?.(window.monaco)
      }
    }, 100)

    return () => clearInterval(interval)
  }, [])
}


export const MonacoEditor = forwardRef<IMultiRefType, TMonacoEditor>((props, ref) => {
    const {
      config,
      onMonacoLoaded,
      Loading:LoadingComp=(<Loading />),
      ...editorProps
    } = props

    useInitMonaco(config, onMonacoLoaded)

    return window.monaco
      ? (<Editor {...editorProps} config={config} ref={ref} />)
      : (<div className='goblet-editor-loading'>{LoadingComp}</div>)
  }
)

MonacoEditor.displayName = 'MonacoEditorEntry'

export default MonacoEditor
