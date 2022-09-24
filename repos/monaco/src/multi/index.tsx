import './index.css'
import React, { useEffect, useState } from 'react'
import Editor, { MultiEditorIProps, MultiRefType } from './Editor'
import { Loading } from '@components/icons/loading'

export const MultiEditor = React.forwardRef<MultiRefType, MultiEditorIProps>(
  (props, ref) => {
    const [, setCount] = useState(0)

    useEffect(() => {
      const interval = setInterval(() => {
        setCount(pre => pre + 1)
        if (window.monaco) {
          clearInterval(interval)
        }
      }, 100)
      return () => {
        clearInterval(interval)
      }
    }, [])

    if (window.monaco) {
      return <Editor {...props} ref={ref} />
    }
    
    return (
      <div className='goblet-monaco-editor-loading'>
        <Loading />
      </div>
    )
  }
)

MultiEditor.displayName = 'MultiEditorEntry'

export default MultiEditor
