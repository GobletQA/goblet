import type { MouseEvent, MutableRefObject } from 'react'
import type { TEditorAction, TMenuItem } from '@gobletqa/components/types'

import { dims } from '@GBC/theme'
import { Menu, MenuToggle } from '../Menu'
import { KebabIcon } from '@GBC/components/Icons'
import { useRef, useState, useMemo } from 'react'
import { ActionsControlId } from '@GBC/constants/values'
import { ActionsContainer } from './EditorActions.styled'
import {useInline} from '@GBC/hooks/components/useInline'

export type TEditorActions<TEditor, TEditorRef extends MutableRefObject<any>=MutableRefObject<any>> = {
  open?:boolean
  curPath:string
  editorRef:TEditorRef
  curValueRef: MutableRefObject<string>
  actions: TEditorAction<TEditor, TEditorRef>[]
}

const styles = {
  dropdown: {
    width: dims.editor.tabs.px,
    height: dims.editor.tabs.px,
    borderLeft: `1px solid var(--goblet-editor-border)`,
  },
  header: {
    width: dims.editor.tabs.px,
    height: dims.editor.tabs.px,
    
    backgroundColor: `var(--goblet-editorGroupHeader-tabsBackground)`,
    [`&:hover`]: {
      
    },
  },
  headerContent: {
    display: `none`
  },
  toggle: {
    color: `var(--goblet-editor-foreground)`,
  }
}

const useEditorItems = <
  TEditor=Record<any, any>,
  TEditorRef extends MutableRefObject<any>=MutableRefObject<any>
>({
  actions,
  curPath,
  editorRef,
  curValueRef,
}:TEditorActions<TEditor, TEditorRef>) => {
  return useMemo(() => {
    return actions.map(action => {
      return {
        ...action,
        onClick: (evt) => action?.onClick?.(
          evt,
          editorRef.current,
          curPath,
          curValueRef.current,
        )
      } as TMenuItem
    })
  }, [actions, curPath])
}

export const EditorActions = <
  TEditor=Record<any, any>,
  TEditorRef extends MutableRefObject<any>=MutableRefObject<any>
>(props:TEditorActions<TEditor, TEditorRef>) => {

  const items = useEditorItems(props)
  const [open, setOpen] = useState<boolean>(false)
  const anchorRef = useRef<HTMLElement|undefined>(undefined)
  const onOpen = useInline((event: MouseEvent<HTMLElement>) => {
    setOpen(true)
    anchorRef.current = event.currentTarget
  })
  const onClose = useInline(() => {
    setOpen(false)
    anchorRef.current = undefined
  })

  return (
    <ActionsContainer className='gb-editor-actions-main' >
      <MenuToggle
        open={open}
        onOpen={onOpen}
        Icon={KebabIcon}
        sx={styles.toggle}
        id="editor-actions"
        controlId={ActionsControlId}
      />
      <Menu
        open={open}
        posTV='top'
        posTH='right'
        posAH='right'
        items={items}
        posAV='bottom'
        onOpen={onOpen}
        onClose={onClose}
        anchorRef={anchorRef}
        id={ActionsControlId}
        aria-labelledby="gb-editor-actions-menu-button"
      />
    </ActionsContainer>
  )
}