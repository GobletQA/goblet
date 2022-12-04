import type { TCodeEditorRef, TEditorAction } from '../../types'
import type { MutableRefObject } from 'react'

import './Actions.css'
import { Action } from './Action'
import { Arrow } from '../Icons/Arrow'
import { useState, useCallback, useRef, useMemo, useEffect } from 'react'
import { cls } from '@keg-hub/jsutils'

export type TActions = {
  open?:boolean
  actions: TEditorAction[]
  editorRef:TCodeEditorRef
  curPathRef: MutableRefObject<string>
  curValueRef: MutableRefObject<string>
}

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

  const onToggle = useCallback(() => {
    const actionsEl = actionsRef.current as HTMLDivElement
    if(!actionsEl) return

    // Actions currently closed - Switch the panel from closed to open
    if(open !== true){
      actionsEl.style.maxHeight = `${lastHeightRef.current || '100vh'}px`
      // IMPORTANT - timeout delay should match the transition time see ./Actions.css
      setTimeout(() => actionsEl.style.maxHeight = ``, 300)
    }

    // Actions currently open - Switch the panel from open to closed
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
    // actionsEl.style.maxHeight = `${lastHeightRef.current}px`
  }, [])

  const style = useMemo(() => {
    return props.open ? { maxHeight: `100vh` } : { maxHeight: `0px` }
  }, [props.open])

  return (
    <div className='goblet-monaco-actions-main' >
      <div
        onClick={onToggle}
        className={cls('goblet-monaco-actions-toggle', { open, closed: !open })}
      >
        <div className='goblet-monaco-actions-toggle-icon'>
          <div className='goblet-monaco-icon-rotate' >
            <Arrow collapse={false} svgStyle={{ height:`20px`, width:`20px` }} />
          </div>
        </div>
      </div>
      <div
        style={style}
        ref={actionsRef}
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