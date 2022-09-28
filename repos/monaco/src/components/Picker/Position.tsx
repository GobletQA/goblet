import type { RefObject, ReactNode } from 'react'
import { useEffect } from 'react'
import ReactDom from 'react-dom'

export type Position = {
  instance: HTMLElement
  children?: ReactNode
  targetRef: RefObject<HTMLElement>
  getContainer?: () => HTMLElement
  onNotVisibleArea?: () => void
}

export const Position = (props:Position) => {
  const {
    instance,
    targetRef,
    children,
    getContainer,
    onNotVisibleArea = () => ({}),
  } = props
  
  const container = (getContainer && getContainer()) || document.body

  useEffect(() => {
    document.body.appendChild(instance)

    return () => {
      if (document.body.contains(instance)) {
        document.body.removeChild(instance)
      }
    }
  }, [instance])

  useEffect(() => {
    function setInstanceStyle() {
      const { top, left, height, width } = targetRef.current!.getBoundingClientRect()
      const style = {
        top: document.documentElement.scrollTop + top + height + 1 + 'px',
        left: document.documentElement.scrollLeft + left + 'px',
      }
      instance.style.top = style.top
      instance.style.left = style.left
      instance.style.width = width + 'px'
      return { top, left, height }
    }
    setInstanceStyle()

    function handleScroll() {
      const { top, height } = setInstanceStyle()

      if (container.offsetTop > top) {
        onNotVisibleArea()
      }
      if (top - container.offsetTop + height > container.offsetHeight) {
        onNotVisibleArea()
      }
    }

    container.addEventListener('scroll', handleScroll)

    return () => {
      container.removeEventListener('scroll', handleScroll)
    }
  }, [targetRef])


  return (<>{ReactDom.createPortal(children, instance)}</>)
}

