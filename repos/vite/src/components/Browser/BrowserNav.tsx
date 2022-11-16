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
import { useBrowserNav } from '@hooks/screencast/useBrowserNav'


export type TBrowserNav = {
  loading: boolean
  initialUrl: string
}

export const BrowserNav = (props:TBrowserNav) => {
  
  const { loading, initialUrl } = props
  const {
    inputRef,
    onGoBack,
    onKeyDown,
    onGoForward,
    backButtonActive,
    forwardButtonActive
  } = useBrowserNav(props)

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
            onClick={onGoBack}
            disabled={!backButtonActive}
          >
            <ArrowBackIcon />
          </BrowserButton>
          <BrowserButton
            onClick={onGoForward}
            disabled={!forwardButtonActive}
          >
            <ArrowForwardIcon />
          </BrowserButton>
          <BrowserButton
            disabled={loading}
            onClick={() => {}}
          >
            {loading ? <DangerousIcon /> : <CachedIcon />}
          </BrowserButton>
        </Box>
        <BrowserInput
          type="text"
          ref={inputRef}
          enterKeyHint="go"
          className='nav-input'
          onKeyDown={onKeyDown}
          defaultValue={initialUrl}
          onFocusCapture={() => inputRef.current?.select()}
        />
      </BrowserNavComp>
  )
  
}