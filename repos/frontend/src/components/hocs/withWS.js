import React, { useMemo } from 'react'
import { Values } from 'HKConstants'
import { useSelector } from 'HKHooks'
import { WSService } from 'HKServices'
import { isEmptyColl } from '@keg-hub/jsutils'
import { SockrProvider } from '@ltipton/sockr'

const { CATEGORIES, STORAGE } = Values


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
    const WSConf = useMemo(() => {
      if(!user || !routes?.screencast) return undefined

      WSService.path = WSService.path
      WSService.query = { containerPort: routes?.screencast?.containerPort }

      return WSService

    }, [user, routes])

    const renderedComp = <Component {...props} />

    return !WSConf
      ? renderedComp
      : (
          <SockrProvider debug={sockrDebug} config={WSService}>
            {renderedComp}
          </SockrProvider>
        )
  }

  WSHoc.displayName = Component.displayName || `WebsocketHoc(<Component>)`

  return WSHoc
}
