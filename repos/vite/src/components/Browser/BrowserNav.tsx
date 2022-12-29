import type { MutableRefObject } from 'react'
import type RFB from '@novnc/novnc/core/rfb'

import Box from '@mui/material/Box'
import { BrowserButton } from './BrowserButton'
import { gutter } from '@gobletqa/components/theme'
import {
  CachedIcon,
  RestartIcon,
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
  rfbRef:MutableRefObject<RFB | null>
}

const styles = {
  icon: { height: `18px`, width: `18px` },
  reconnect: {
    marginLeft: gutter.margin.qpx,
    marginRight: gutter.margin.hpx
  }
}

export const BrowserNav = (props:TBrowserNav) => {
  
  const { loading, initialUrl } = props
  const {
    inputRef,
    onGoBack,
    onKeyDown,
    navLoading,
    onReconnect,
    onGoForward,
    onReloadPage,
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
            tooltip='Click to go back'
            disabled={!backButtonActive}
          >
            <ArrowBackIcon sx={styles.icon} />
          </BrowserButton>
          <BrowserButton
            onClick={onGoForward}
            tooltip='Click to go forward'
            disabled={!forwardButtonActive}
          >
            <ArrowForwardIcon sx={styles.icon} />
          </BrowserButton>
          <BrowserButton
            onClick={onReloadPage}
            tooltip='Reload this page'
            disabled={loading || navLoading}
          >
            {loading || navLoading ? <DangerousIcon sx={styles.icon} /> : <CachedIcon sx={styles.icon} />}
          </BrowserButton>
        </Box>
        <BrowserInput
          type="text"
          ref={inputRef}
          enterKeyHint="go"
          onKeyDown={onKeyDown}
          defaultValue={initialUrl}
          className='browser-nav-input'
          onFocusCapture={() => inputRef.current?.select()}
        />
        
        <BrowserButton
          sx={styles.reconnect}
          onClick={onReconnect}
          tooltip='Click to reconnect'
        >
          <RestartIcon sx={styles.icon} />
        </BrowserButton>
      </BrowserNavComp>
  )
  
}