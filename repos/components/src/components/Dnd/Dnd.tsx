import type {
  MutableRefObject,
  MouseEventHandler,
  KeyboardEventHandler
} from 'react'
import type { TOnDrop } from '@GBC/hooks/dnd/useDndHooks'

import { DragIndicatorIcon } from '../Icons'
import { useDndHooks } from '@GBC/hooks/dnd/useDndHooks'
import {
  DragButton,
  DropContainer,
  DragContainer,
} from './Dnd.styled'


export type TDndCallbacks = {
  onDrop: TOnDrop
  onKeyDown?: KeyboardEventHandler<Element>
  onClick?: MouseEventHandler<HTMLDivElement>
}

export type TDnd = TDndCallbacks & {
  index: number
  data?:string
  showHandle?: boolean
  children: React.ReactNode
  dragImagePos?:[number, number]
  dragHandleRef?: MutableRefObject<HTMLElement>
}

export const Dnd = (props: TDnd) => {

  const {
    index,
    onClick,
    children,
    showHandle = false,
    dragHandleRef:pDragHandleRef
  } = props

  const {
    onHideDiv,
    onShowDiv,
    onDragEnd,
    onDragOver,
    onDragStart,
    onDragLeave,
    onDragEnter,
    onDropAfter,
    onDropBefore,
    onDragHandleFocus,
    onContainerKeyDown,
    onDragHandleKeyDown,
    dragDivRef,
    dragHandleRef,
  } = useDndHooks(props)

  if (showHandle && dragHandleRef?.current) dragHandleRef.current.style.display = 'inherit'

  return (
    <>
      {index === 0 && (
        <DropContainer
          onDrop={onDropBefore}
          onDragOver={onDragOver}
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
          className={`gb-dnd-drop-container`}
        />
      )}
      <DragContainer
        tabIndex={0}
        ref={dragDivRef}
        draggable='true'
        onClick={onClick}
        onDragEnd={onDragEnd}
        onMouseEnter={onShowDiv}
        onMouseLeave={onHideDiv}
        onDragStart={onDragStart}
        onFocus={onDragHandleFocus}
        onKeyDown={onContainerKeyDown}
        className={`gb-dnd-drag-container`}
      >
        {!pDragHandleRef && (
          <DragButton
            tabIndex={0}
            role='button'
            onBlur={onHideDiv}
            ref={dragHandleRef}
            aria-label='drag button'
            onKeyDown={onDragHandleKeyDown}
            className={`gb-dnd-drag-handle`}
          >
            <DragIndicatorIcon className={`gb-drag-indicator-icon`} />
          </DragButton>
        )}
        {children}
      </DragContainer>
      <DropContainer
        onDrop={onDropAfter}
        onDragOver={onDragOver}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        className={`gb-dnd-drop-container`}
      />
    </>
  )
}
