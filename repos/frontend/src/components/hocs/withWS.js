import React, { useMemo } from 'react'
import { Values } from 'HKConstants'
import { useSelector } from 'HKHooks'
import { WSService } from 'HKServices'
import { SockrProvider } from 'HKGSockr'

const { CONTAINER, CATEGORIES, STORAGE } = Values


// Uncomment to see sockr logs in development
// const sockrDebug = process.env.NODE_ENV !== 'production'
// Remove to see sockr logs in development
const sockrDebug = false

/**
 * Wraps the component with AppHeader
 *
 * @param {Object} title - title on the app header
 * @param {Object} Component - React component to be wrapped
 *
 * @returns {function} - wrapped functional component
 */
export const withWS = (Component) => {
  const WSHoc = props => {

    const { user, routes } = useSelector(STORAGE.USER, CATEGORIES.ROUTES)
    const socketReady = useMemo(() => {
      if(!user || !routes?.api || routes?.meta?.state !== CONTAINER.STATE.RUNNING)
        return false

      WSService.protocol = `http`
      WSService.ioConfig.query = {
        ...WSService.ioConfig.query,
        containerPort: routes?.api?.containerPort,
      }

      return true
    }, [user, routes])

    const renderedComp = <Component {...props} />

    return !socketReady
      ? renderedComp
      : (
          <SockrProvider debug={sockrDebug} config={WSService} >
            {renderedComp}
          </SockrProvider>
        )
  }

  WSHoc.displayName = Component.displayName || `WebsocketHoc(<Component>)`

  return WSHoc
}
