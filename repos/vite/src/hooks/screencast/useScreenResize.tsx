import type {
  TBrowserSettingValues
} from '@types'
import type { RefObject } from 'react'

import { useState, useRef, useEffect } from 'react'
import { noOpObj, debounce as debounceJs } from '@keg-hub/jsutils'
import { ScreencastWidth, ScreencastHeight } from '@constants'
import { useSettingValues } from '@hooks/store/useSettingValues'

type TDebounce = <T=(...args:any[])=> any>(func: (...params: any[]) => any, wait?: number, immediate?: boolean) => T
const debounce = debounceJs as TDebounce

export type TScreenDimsFull = {
  width: number
  ratio: number
  height: number
}

export type TScreenDims = Omit<TScreenDimsFull, 'ratio'> & {
  ratio?: number
}

export type TScreenDimsOpts = {
  width?: number
  ratio?: number
  height?: number
}

const defSize:TScreenDimsFull = {
  width: ScreencastWidth,
  height: ScreencastHeight,
  ratio: Math.round(((ScreencastWidth / ScreencastHeight) + Number.EPSILON) * 100) / 100,
}

export const sizeFromRatio = ({ height, width }:TScreenDims) => {
  const size = { ...defSize }

  if (height < size.height) {
    size.height = height
    size.width = defSize.ratio * height
  }
  if (width < size.width) {
    size.width = width
    size.height = width / defSize.ratio
  }

  const calcSize:TScreenDims = {
    width: Math.round(size.width),
    height: Math.round(size.height),
  }
  
  calcSize.ratio = Math.round(((calcSize.width / calcSize.height) + Number.EPSILON) * 100) / 100

  return calcSize as TScreenDimsFull
}

export const useScreenResize = (
  screenRef:RefObject<HTMLElement> | undefined,
  screenSize:TScreenDimsOpts = noOpObj as TScreenDimsOpts
) => {
  const { height, width } = useSettingValues<TBrowserSettingValues>(`browser`)
  
  const [screenRect, setScreenRect] = useState<TScreenDims>({ height, width, ...screenSize })

  useEffect(() => {
    if (!screenRef?.current) return

    const canvasParentEl = screenRef.current?.parentNode as HTMLElement
    const rect = canvasParentEl?.getBoundingClientRect?.()
    const calcSize = sizeFromRatio(rect)

    ;(calcSize.width !== screenRect.width || calcSize.height !== screenRect.height)
      && setScreenRect(calcSize)

    const observer = new ResizeObserver(debounce(entries => {
      const contentRect = entries[0]?.contentRect
      if (!contentRect) return

      const boundingRect = canvasParentEl.getBoundingClientRect()
      setScreenRect(sizeFromRatio(boundingRect))

      window.requestAnimationFrame(() =>
        window.dispatchEvent(new UIEvent('resize'))
      )
    }, 250, false))

    observer.observe(canvasParentEl)

    return () => canvasParentEl && observer.unobserve(canvasParentEl)
  }, [screenRef?.current, setScreenRect])

  return {
    screenRef,
    screenRect,
    setScreenRect,
  }
}
