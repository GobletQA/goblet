import type { MouseEventHandler, KeyboardEventHandler } from 'react'

import { useCallback, useRef, CSSProperties } from 'react'

import { cls } from '@keg-hub/jsutils'
import { styles } from './Sort.styled'
import {DragIndicatorIcon} from '../Icons'


type SortTypes = {
  onClick?: MouseEventHandler<HTMLDivElement>
  onKeyDown?: KeyboardEventHandler<Element>
  onDrop: (droppedIndex: number, index: number) => Promise<void> | void
  index: number
  children: React.ReactNode
  showHandle?: boolean
}
const dropIndicator = document.createElement('hr')

const dragBtnStyle: CSSProperties = {
  left: `18px`,
  display: `none`,
  position: `absolute`,
}

export const Sort = ({
  index,
  onDrop,
  onClick,
  children,
  showHandle = false,
  onKeyDown,
}: SortTypes) => {
  const dragDiv = useRef<HTMLDivElement>(null)
  const dragButton = useRef<HTMLDivElement>(null)
  const shiftTabPressed = useRef(false)
  const classes = {}
  // dropIndicator.className = classes.hr

  const onDropBefore = useCallback(
    (ev: React.DragEvent) => {
      ev.preventDefault()
      const fromIndex = Number(ev.dataTransfer.getData('text/plain'))
      onDrop(index, fromIndex)
    },
    [onDrop, index]
  )

  const onDropAfter = useCallback(
    (ev: React.DragEvent) => {
      ev.preventDefault()
      const fromIndex = Number(ev.dataTransfer.getData('text/plain'))
      const newIndex = index >= fromIndex ? index : index + 1
      onDrop(newIndex, fromIndex)
    },
    [onDrop, index]
  )

  const onDragEnter = useCallback((ev: React.DragEvent) => {
    ev.preventDefault()
    ev.currentTarget.appendChild(dropIndicator)
  }, [])

  const onDragOver = useCallback((ev: React.DragEvent) => {
    ev.preventDefault()
  }, [])

  const onDragLeave = useCallback((ev: React.DragEvent) => {
    ev.preventDefault()
    dropIndicator.remove()
  }, [])

  const onDragStart = useCallback(
    (ev: React.DragEvent) => {
      ev.dataTransfer.setData('text/plain', index.toString())
      ev.dataTransfer.dropEffect = 'move'
      ev.dataTransfer.effectAllowed = 'move'
      const dimensions = ev.currentTarget.getBoundingClientRect()
      ev.dataTransfer.setDragImage(ev.currentTarget, dimensions.width / 2, 0)

      dragDiv.current
        && (dragDiv.current.className = cls(classes.dragContainer, classes.dragContainerHold))
    },
    [index, dragDiv]
  )

  const onDragEnd = useCallback(
    (ev: React.DragEvent) => {
      onDragLeave(ev)
      dragDiv.current
        && (dragDiv.current.className = classes.dragContainer)
    },
    [dragDiv]
  )

  const showDiv = useCallback(() => {
    if (!dragDiv.current) return

    dragDiv.current.className = cls(classes.dragContainer, classes.dragContainerHover)
    dragButton.current && (dragButton.current.style.display = 'inherit')

  }, [dragDiv, dragButton])

  const hideDiv = useCallback(() => {
    if (!dragDiv.current) return

    dragDiv.current.className = classes.dragContainer
    
    !showHandle
      && dragButton.current
      && (dragButton.current.style.display = 'none')
  }, [dragDiv, dragButton, showHandle])

  const focusOnButton = useCallback(
    (e: React.FocusEvent) => {
      if (!dragButton) return
      showDiv()

      !shiftTabPressed.current
        && dragButton.current
        && dragButton.current.focus()
    },
    [dragButton, shiftTabPressed]
  )

  const arrowKeys = useCallback(
    (keyE: React.KeyboardEvent) => {
      if (!dragButton || document.activeElement !== dragButton.current) return
      if (keyE.key !== 'ArrowDown' && keyE.key !== 'ArrowUp') return

      keyE.preventDefault()
      keyE.stopPropagation()
      if (keyE.key === 'ArrowUp') {
        if (index === 0) return
        onDrop(index - 1, index)
      }
      else if (keyE.key === 'ArrowDown') {
        onDrop(index + 1, index)
      }
    },
    [dragButton, index, onDrop]
  )

  const shiftTab = useCallback((keyE: React.KeyboardEvent) => {
    if (keyE.shiftKey && keyE.key === 'Tab') {
      shiftTabPressed.current = true
      hideDiv()
    }
    else if (keyE.key === 'Enter') {
      onKeyDown && onKeyDown(keyE)
    }
  }, [])

  if (showHandle && dragButton?.current) dragButton.current.style.display = 'inherit'

  return (
    <>
      {index === 0 && (
        <div
          className={classes.dropContainer}
          onDragOver={onDragOver}
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
          onDrop={onDropBefore}
        ></div>
      )}
      <div
        draggable='true'
        onClick={onClick}
        onMouseEnter={showDiv}
        onMouseLeave={hideDiv}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        className={classes.dragContainer}
        ref={dragDiv}
        tabIndex={0}
        onFocus={focusOnButton}
        onKeyDown={shiftTab}
      >
        <div
          ref={dragButton}
          style={dragBtnStyle}
          className={classes.dragButton}
          role='button'
          aria-label='drag button'
          tabIndex={0}
          onBlur={hideDiv}
          onKeyDown={arrowKeys}
        >
          <DragIndicatorIcon />
        </div>
        {children}
      </div>
      <div
        className={classes.dropContainer}
        onDragOver={onDragOver}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDrop={onDropAfter}
      ></div>
    </>
  )
}
