import { MouseEvent, useCallback, useState } from 'react'

import { EBrowserState } from '@types'
import { BrowserMouse } from './BrowserMouse'

import {
  BrowserCoverClick,
  BrowserMouseText,
  BrowserMouseIcon,
  BrowserMouseContainer,
} from './Browser.styled'
import { cls } from '@keg-hub/jsutils'

const styles = {
  playing: {},
  recording: {
    display: `none`
  },
  idle: {
    display: `none`
  },
}

export type TBrowserCover = {
  clickHidden:boolean
  browserState:EBrowserState
  intentClickSetting?:boolean
  setClickHidden:(state:boolean) => any
  setBrowserState?:(state:EBrowserState) => void
}


export const BrowserCover = (props:TBrowserCover) => {

  const {
    clickHidden,
    browserState,
    setClickHidden,
    intentClickSetting,
  } = props

  const style = !intentClickSetting || clickHidden
    ? styles[browserState]
    : styles.playing

  const onClick = useCallback((evt:MouseEvent) => {
    evt.stopPropagation()
    evt.preventDefault()
    setClickHidden(!clickHidden)
  }, [clickHidden])

  return (
    <BrowserCoverClick
      sx={style}
      onClick={onClick}
      className={cls(
        `gb-browser-cover`,
        (browserState !== EBrowserState.idle) || !intentClickSetting || clickHidden
          ? browserState
          : `follow`
      )}
    >
      {intentClickSetting && !clickHidden && (
        <BrowserMouse y={30} x={-60}>
          <BrowserMouseContainer>
            <BrowserMouseIcon />
            <BrowserMouseText>
              Click to interact
            </BrowserMouseText>
          </BrowserMouseContainer>
        </BrowserMouse>
      ) || null}
    </BrowserCoverClick>
  )
}