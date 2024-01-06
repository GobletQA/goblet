import type { CSSProperties } from 'react'
import {
  cmx,
  colors,
  gutter,
} from '@gobletqa/components'

export type TErrFallback = {
  error:Error,
  resetErrorBoundary:any
}

const styles:Record<string, CSSProperties> = {
  backdrop: {
    position: `fixed`,
    top: `0px`,
    left: `0px`,
    right: `0px`,
    bottom: `0px`,
    height: `100vh`,
    width: `100vw`,
    zIndex: 99999998,
    backgroundColor: cmx(colors.gray15),
  },
  container: {
    top: `25%`,
    left: `25%`,
    display:`flex`,
    zIndex: 99999999,
    position: `fixed`,
    minWidth: `50vw`,
    alignItems: `start`,
    flexDirection: `column`,
    justifyContent: `center`,
    padding: gutter.padding.dpx,
    backgroundColor: colors.white,
  },
  header: {
    margin: `0px`,
    color: colors.red09,
  },
  content: {
    flex: `1`,
    width: `100%`,
    display: `flex`,
    flexDirection: `column`,
    marginTop: gutter.margin.px,
  },
  info: {
    marginBottom: gutter.margin.px,
  },
  error: {
    padding: gutter.padding.px,
    backgroundColor: colors.gray01,
  },
  message: {
    color: colors.black,
  },
  actions: {
    textAlign: `right`,
    marginTop: gutter.margin.dpx,
  },
  action: {
    border: `none`,
    cursor: `pointer`,
    alignItems: `end`,
    borderRadius: `3px`,
    color: colors.white,
    backgroundColor: colors.red09,
    maxWidth: `150px`,
    padding: `${gutter.padding.hpx} ${gutter.padding.px}`,
  },
}

export const ErrFallback = (props:TErrFallback) => {
  const { error } = props

  return (
    <>
      <div
        style={styles.backdrop}
        className='gb-error-fallback-backdrop'
      ></div>
      <div
        role="alert"
        style={styles.container}
        className='gb-error-fallback-container'
      >
        <h2
          style={styles.header}
          className='gb-error-fallback-header'
        >
          Unexpected Event Occurred:
        </h2>
        <div
          style={styles.content}
          className='gb-error-fallback-content'
        >
          <div
            style={styles.info}
            className='gb-error-fallback-info'
          >
            <p>
              Goblet encountered and unexpected event and can not recover. We apologize for the inconvenience.<br/>Please reload the page to continue.
            </p>
          </div>
        
          <div
            style={styles.error}
            className='gb-error-fallback-error'
          >
            <b>Error:</b>
            <pre
              style={styles.message}
              className='gb-error-fallback-message'
            >
              {error.message}
            </pre>
          </div>
          <div
            style={styles.actions}
            className='gb-error-fallback-actions-container'
          >
            <button
              style={styles.action}
              className='gb-error-fallback-action'
              onClick={() => window.location.reload()}
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    </>
  )
  
}