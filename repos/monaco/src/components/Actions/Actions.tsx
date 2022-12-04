import type { TCodeEditorRef, TEditorAction } from '../../types'
import type { MutableRefObject } from 'react'

import './Actions.css'
import { Action } from './Action'
import { useState, useCallback, useRef, useMemo, useEffect } from 'react'
import { cls } from '@keg-hub/jsutils'

export type TActions = {
  open?:boolean
  actions: TEditorAction[]
  editorRef:TCodeEditorRef
  curPathRef: MutableRefObject<string>
  curValueRef: MutableRefObject<string>
}

const actionsStyle = { maxHeight: `0px` }

export const Actions = (props:TActions) => {
  const {
    actions,
    editorRef,
    curPathRef,
    curValueRef,
  } = props

  const [open, setOpen] = useState<boolean>(props.open || false)
  const actionsRef = useRef<HTMLDivElement>(null)
  const lastHeightRef = useRef<number>(0) as MutableRefObject<number>

  // const onToggle = useCallback(() => setOpen(!open), [open])
  const onToggle = useCallback(() => {
    const actionsEl = actionsRef.current as HTMLDivElement
    if(!actionsEl) return

    if(open !== true){
      actionsEl.style.maxHeight = `${lastHeightRef.current || '100vh'}px`
      // IMPORTANT - timeout delay should match the transition time see ./Actions.css
      setTimeout(() => actionsEl.style.maxHeight = ``, 300)
    }
    else {
      lastHeightRef.current = actionsEl.offsetHeight
      actionsEl.style.maxHeight = `${lastHeightRef.current}px`
      setTimeout(() => actionsEl.style.maxHeight = `0px`, 0)
    }

    setOpen(!open)
  }, [open])

  useEffect(() => {
    const actionsEl = actionsRef.current as HTMLDivElement
    if(!actionsEl) return

    lastHeightRef.current = actionsEl.offsetHeight
    actionsEl.style.maxHeight = `${lastHeightRef.current}px`
  }, [])

  return (
    <div className='goblet-monaco-actions-main' >
      <div
        onClick={onToggle}
        className={cls('goblet-monaco-actions-toggle', { open, closed: !open })}
      >
        <div className='goblet-monaco-actions-toggle-icon'>
          <div className='goblet-monaco-icon-rotate' >
            ▼
          </div>
        </div>
      </div>
      <div
        ref={actionsRef}
        style={actionsStyle}
        className='goblet-monaco-actions-list'
      >
        {actions.map((action => {
          return (
            <Action
              key={action.id || action.name}
              editorRef={editorRef}
              curPathRef={curPathRef}
              curValueRef={curValueRef}
              {...action}
            />
          )
        }))}
      </div>
    </div>
  )
}