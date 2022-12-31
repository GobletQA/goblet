import type { TAction } from '../../types'
import type { MutableRefObject } from 'react'

import { Action } from './Action'
import { ChevronDownIcon } from '../Icons'
import { useState, useCallback, useRef, useMemo, useEffect } from 'react'
import { cls } from '@keg-hub/jsutils'
import {
  ActionsList,
  ActionsToggle,
  ActionsContainer,
  ActionsToggleWrap,
} from './Actions.styled'

export type TActions<TEditor, TEditorRef extends MutableRefObject<any>=MutableRefObject<any>> = {
  open?:boolean
  actions: TAction<TEditor, TEditorRef>[]
  editorRef:TEditorRef
  curPathRef: MutableRefObject<string>
  curValueRef: MutableRefObject<string>
}

export const Actions = <
  TEditor=Record<any, any>,
  TEditorRef extends MutableRefObject<any>=MutableRefObject<any>
>(props:TActions<TEditor, TEditorRef>) => {
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
    <ActionsContainer className='goblet-editor-actions-main' >
      <ActionsToggle
        onClick={onToggle}
        className={cls('goblet-editor-actions-toggle', { open, closed: !open })}
      >
        <ActionsToggleWrap className='goblet-editor-actions-toggle-icon'>
          <div className='goblet-editor-icon-rotate' >
            <ChevronDownIcon />
          </div>
        </ActionsToggleWrap>
      </ActionsToggle>
      <ActionsList
        style={style}
        ref={actionsRef}
        className='goblet-editor-actions-list'
      >
        {actions.map((action => {
          return (
            <Action
              key={action.id || action.name}
              {...action}
              editorRef={editorRef}
              curPathRef={curPathRef}
              curValueRef={curValueRef}
            />
          )
        }))}
      </ActionsList>
    </ActionsContainer>
  )
}