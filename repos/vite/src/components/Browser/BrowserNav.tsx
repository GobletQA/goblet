import type { MutableRefObject } from 'react'
import type RFB from '@novnc/novnc/core/rfb'

import { EBrowserState } from '@types'
import { BrowserState } from './BrowserState'
import { capitalize } from '@keg-hub/jsutils'
import { BrowserButton } from './BrowserButton'
import {
  Text,
  colors,
  gutter,
  CachedIcon,
  AlertIcon,
  RestartIcon,
  DangerousIcon,
  ArrowBackIcon,
  ArrowForwardIcon
} from '@gobletqa/components'
import {
  BrowserInput,
  BrowserNavActions,
  BrowserNav as BrowserNavComp,
} from './Browser.styled'
import { useBrowserNav } from '@hooks/screencast/useBrowserNav'

export type TBrowserNav = {
  loading: boolean
  initialUrl: string
  browserState:EBrowserState
  setBrowserState?:(state:EBrowserState) => void
  rfbRef:MutableRefObject<RFB | null>
}

const styles = {
  icon: { height: `18px`, width: `18px` },
  reconnect: {
    marginLeft: gutter.margin.qpx,
    marginRight: gutter.margin.hpx
  },
  alert: {
    color: colors.red10,
    marginLeft: gutter.margin.qpx,
    marginRight: gutter.margin.qpx
  }
  
}

export const BrowserNav = (props:TBrowserNav) => {
  
  const {
    loading,
    initialUrl,
    browserState,
    setBrowserState
  } = props
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
        <BrowserNavActions className='goblet-browser-left-nav-actions' >
          <BrowserButton
            onClick={onGoBack}
            tooltip='Click to go back'
            disabled={!backButtonActive}
            className='goblet-browser-back-action'
          >
            <ArrowBackIcon sx={styles.icon} />
          </BrowserButton>
          <BrowserButton
            onClick={onGoForward}
            tooltip='Click to go forward'
            disabled={!forwardButtonActive}
            className='goblet-browser-forward-action'
          >
            <ArrowForwardIcon sx={styles.icon} />
          </BrowserButton>
          <BrowserButton
            onClick={onReloadPage}
            tooltip='Reload this page'
            disabled={loading || navLoading}
            className='goblet-browser-reload-action'
          >
            {loading || navLoading ? <DangerousIcon sx={styles.icon} /> : <CachedIcon sx={styles.icon} />}
          </BrowserButton>
        </BrowserNavActions>
        <BrowserInput
          type="text"
          ref={inputRef}
          enterKeyHint="go"
          onKeyDown={onKeyDown}
          defaultValue={initialUrl}
          className='browser-nav-input'
          onFocusCapture={() => inputRef.current?.select()}
        />
        <BrowserNavActions
          sx={{ minWidth: `initial` }}
          className='goblet-browser-right-nav-actions'
        >
          <BrowserState browserState={browserState} />
          <BrowserButton
            sx={styles.reconnect}
            onClick={onReconnect}
            tooltip='Click to reconnect'
            className='goblet-browser-reconnect-action'
          >
            <RestartIcon sx={styles.icon} />
          </BrowserButton>
        </BrowserNavActions>
      </BrowserNavComp>
  )
  
}