import type { MouseEvent } from 'react'

import { useState } from 'react'
import { EBrowserState } from '@types'


import {
  BrowserCoverClick,
  BrowserIntentClick,
  BrowserIntentClickBtn,
  BrowserIntentClickText,
  BrowserIntentClickIcon,
} from './Browser.styled'

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

const IntentClick = (props:TBrowserCover) => {
  const { clickHidden, setClickHidden } = props

  const onClick = (evt:MouseEvent) => {
    evt.stopPropagation()
    evt.preventDefault()
    setClickHidden(!clickHidden)
  }

  return (
    <BrowserIntentClick
      onClick={onClick}
      className='pb-browser-intent-click'
    >
      <BrowserIntentClickBtn
        className='pb-browser-intent-click-button'
      >
        <BrowserIntentClickIcon
          className='pb-browser-intent-click-icon'
        />
        <BrowserIntentClickText
          className='pb-browser-intent-click-text'
        >
          Click to interact
        </BrowserIntentClickText>
      </BrowserIntentClickBtn>
    </BrowserIntentClick>
  )
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

  return (
    <BrowserCoverClick
      sx={style}
      className='gb-browser-cover'
    >
      {intentClickSetting && !clickHidden && (
        <IntentClick
          {...props}
          clickHidden={clickHidden}
          setClickHidden={setClickHidden}
        />
      ) || null}
    </BrowserCoverClick>
  )
}