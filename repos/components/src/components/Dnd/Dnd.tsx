import type { CSSProperties, MouseEventHandler, KeyboardEventHandler } from 'react'

import './Dnd.styled.tsx'
import {DragIndicatorIcon} from '../Icons'
import { useDndHooks } from '@GBC/hooks/dnd/useDndHooks'
import {
  DragButton,
  DropContainer,
  DragContainer,
} from './Dnd.styled'


type TDnd = {
  index: number
  showHandle?: boolean
  children: React.ReactNode
  onClick?: MouseEventHandler<HTMLDivElement>
  onKeyDown?: KeyboardEventHandler<Element>
  onDrop: (droppedIndex: number, index: number) => Promise<void> | void
}

const dragBtnStyle: CSSProperties = {
  left: `18px`,
  display: `none`,
  position: `absolute`,
}

export const Dnd = (props: TDnd) => {

  const {
    index,
    onClick,
    children,
    showHandle = false,
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
    onButtonFocus,
    onButtonKeyDown,
    onContainerKeyDown,
    dragDivRef,
    dragButtonRef,
  } = useDndHooks(props)

  if (showHandle && dragButtonRef?.current) dragButtonRef.current.style.display = 'inherit'

  return (
    <>
      {index === 0 && (
        <DropContainer
          onDrop={onDropBefore}
          onDragOver={onDragOver}
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
          className={`gb-drop-container`}
        />
      )}
      <DragContainer
        tabIndex={0}
        ref={dragDivRef}
        draggable='true'
        onClick={onClick}
        onDragEnd={onDragEnd}
        onFocus={onButtonFocus}
        onMouseEnter={onShowDiv}
        onMouseLeave={onHideDiv}
        onDragStart={onDragStart}
        onKeyDown={onContainerKeyDown}
        className={`gb-drag-container`}
      >
        <DragButton
          role='button'
          tabIndex={0}
          onBlur={onHideDiv}
          ref={dragButtonRef}
          style={dragBtnStyle}
          aria-label='drag button'
          onKeyDown={onButtonKeyDown}
          className={`gb-drag-button`}
        >
          <DragIndicatorIcon />
        </DragButton>
        {children}
      </DragContainer>
      <DropContainer
        onDrop={onDropAfter}
        onDragOver={onDragOver}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        className={`gb-drop-container`}
      />
    </>
  )
}
