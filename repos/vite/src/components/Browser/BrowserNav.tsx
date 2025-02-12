import type { MutableRefObject } from 'react'
import type RFB from '@novnc/novnc/core/rfb'

import { BrowserButton } from './BrowserButton'
import {
  colors,
  gutter,
  CachedIcon,
  IconButton,
  RestartIcon,
  TerminalIcon,
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
  rfbRef:MutableRefObject<RFB | null>
}

const styles = {
  icon: {
    width: `18px`,
    height: `18px`,
  },
  reconnect: {
    marginLeft: gutter.margin.qpx,
    marginRight: gutter.margin.hpx
  },
  inspector: {
    marginLeft: `0px`,
    padding: gutter.margin.qpx,
    marginRight: gutter.margin.hpx,
  },
  alert: {
    color: colors.red10,
    marginLeft: gutter.margin.qpx,
    marginRight: gutter.margin.qpx
  },
  action: {
    minWidth: `initial`
  }
}

export const BrowserNav = (props:TBrowserNav) => {

  const {
    loading,
    initialUrl,
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
    onBrowserSettings,
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
            {
              (loading || navLoading)
                ? (<DangerousIcon sx={styles.icon} />)
                : (<CachedIcon sx={styles.icon} />)
            }
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
          sx={styles.action}
          className='goblet-browser-right-nav-actions'
        >
          <BrowserButton
            sx={styles.reconnect}
            onClick={onReconnect}
            tooltip='Force browser restart'
            className='goblet-browser-reconnect-action'
          >
            <RestartIcon sx={styles.icon} />
          </BrowserButton>

          <IconButton
            sx={styles.inspector}
            onClick={onBrowserSettings}
            tooltip='Open browser inspector'
            className='goblet-browser-settings-action'
            Icon={(props:any) => <TerminalIcon {...props} sx={styles.icon} />}
          />
        </BrowserNavActions>

      </BrowserNavComp>
  )
  
}