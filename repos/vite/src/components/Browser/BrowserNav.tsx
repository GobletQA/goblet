import type { MutableRefObject } from 'react'

import { useCallback } from 'react'
import Box from '@mui/material/Box'
import { BrowserButton } from './BrowserButton'
import {
  CachedIcon,
  DangerousIcon,
  ArrowBackIcon,
  ArrowForwardIcon
} from '@components/Icons'
import {
  BrowserInput,
  BrowserNav as BrowserNavComp,
} from './Browser.styled'


export type TBrowserNav = {
  loading: boolean
  history:string[]
  position: number
  canGoBack:boolean
  initialUrl: string
  canGoForward: boolean
  setUrl:(url:string) => any
  changeUrl:(url:string) => any
  changeHistory: (change:number) => any
  inputRef: MutableRefObject<HTMLInputElement | null>
}

export const BrowserNav = (props:TBrowserNav) => {
  
  const {
    setUrl,
    history,
    loading,
    inputRef,
    position,
    changeUrl,
    canGoBack,
    initialUrl,
    canGoForward,
    changeHistory
  } = props
  
  const onKeyDown = useCallback(({ key }:Record<'key', string>) => {
    if(!inputRef?.current || key !== "Enter") return

    changeUrl(inputRef.current.value)
    window.getSelection()?.removeAllRanges()
    inputRef.current.blur()
  }, [])
  
  return (
      <BrowserNavComp className='goblet-browser-nav'>
        <Box
          sx={{
            width: `102px`,
            display: 'flex',
            minWidth: `102px`,
            paddingLeft: `6px`,
            justifyContent: 'space-around',
          }}
          className='goblet-browser-nav-container'
        >
          <BrowserButton
            disabled={!canGoBack}
            onClick={() => changeHistory(-1)}
          >
            <ArrowBackIcon />
          </BrowserButton>
          <BrowserButton
            disabled={!canGoForward}
            onClick={() => changeHistory(+1)}
          >
            <ArrowForwardIcon />
          </BrowserButton>
          <BrowserButton
            disabled={loading}
            onClick={() => setUrl(history[position])}
          >
            {loading ? <DangerousIcon /> : <CachedIcon />}
          </BrowserButton>
        </Box>
        <BrowserInput
          ref={inputRef}
          enterKeyHint="go"
          className='nav-input'
          onKeyDown={onKeyDown}
          defaultValue={initialUrl}
          onFocusCapture={() => inputRef.current?.select()}
          type="text"
        />
      </BrowserNavComp>
  )
  
}