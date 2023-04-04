import type { TDndCallbacks } from '@GBC/types'
import type { CSSProperties, MutableRefObject, FocusEventHandler, MouseEventHandler } from 'react'

import { emptyArr } from '@keg-hub/jsutils'
import { DragIndicatorIcon } from '../Icons'
import { useDndHooks } from '@GBC/hooks/dnd/useDndHooks'
import {
  DragButton,
  DropContainer,
  DragContainer,
} from './Dnd.styled'

export type TDnd = TDndCallbacks & {
  data?:string
  index: number
  exact?:boolean
  parentTypes?:string[]
  showDragHandle?: boolean
  children: React.ReactNode
  dragHandleSx?: CSSProperties
  dragImagePos?:[number, number]
  dragHandleRef?:MutableRefObject<HTMLElement>
}

export const Dnd = (props: TDnd) => {

  const {
    index,
    onClick,
    children,
    dragHandleSx,
    parentTypes=emptyArr,
    showDragHandle = false,
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
    dragDivRef,
    dragHandleRef,
    onDragHandleFocus,
    onContainerKeyDown,
    onDragHandleKeyDown,
  } = useDndHooks(props)

  return (
    <>
      {index === 0 && (
        <DropContainer
          onDrop={onDropBefore}
          onDragOver={onDragOver}
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
          className={`gb-dnd-drop-container`}
          data-parent-types={parentTypes.join(',')}
        />
      )}
      <DragContainer
        tabIndex={0}
        ref={dragDivRef}
        draggable='true'
        onClick={onClick}
        onDragEnd={onDragEnd}
        onDragStart={onDragStart}
        onFocus={onDragHandleFocus}
        onKeyDown={onContainerKeyDown}
        className={`gb-dnd-drag-container`}
        onMouseEnter={onShowDiv as MouseEventHandler<HTMLDivElement>}
        onMouseLeave={onHideDiv as MouseEventHandler<HTMLDivElement>}
      >
        {showDragHandle && !pDragHandleRef && (
          <DragButton
            tabIndex={0}
            role='button'
            sx={dragHandleSx}
            ref={dragHandleRef}
            aria-label='drag button'
            onKeyDown={onDragHandleKeyDown}
            className={`gb-dnd-drag-handle`}
            data-parent-types={parentTypes.join(',')}
            onBlur={onHideDiv as FocusEventHandler<HTMLDivElement>}
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
        data-parent-types={parentTypes.join(',')}
      />
    </>
  )
}
