import { useState, useEffect, useCallback } from 'react'
import { Values } from 'HKConstants'
import { useSelector } from 'HKHooks/useSelector'
import { useScreenResize } from './useScreenResize'
import { getWorldVal } from 'HKUtils/repo/getWorldVal'
import { actionBrowser } from 'HKActions/screencast/api/actionBrowser'

const { STORAGE, CATEGORIES } = Values

/**
 * Helper method to auto open the ap url in the screencast browser when it loads
 * @param {Object} repo - Repo metadata object from the store
 */
const openAppUrl = repo => {
  const appUrl = getWorldVal(`url`, `app.url`, undefined, repo)

  appUrl &&
    actionBrowser({
      ref: 'page',
      actions: [{
        action: 'goto',
        props: [appUrl],
      }],
    }, false)
}

const throwMissingPort = (routes) => {
  console.error(`Can not connect VNC, missing container port`)
  console.log(routes)

  throw new Error(`VNC Error - Missing container port`)
}

/**
 * Helper to initialize noVNC service
 * @param {Object} element - Dom element to attach the canvas to
 * @param {string} vncUrl - Url to connect to the VNC websocket
 * @param {Object} creds - Credentials to connect to the VNC websocket
 *
 * @returns {Object} - Contains an instance of the NoVncService
 */
export const useNoVnc = (element, vncUrl, creds) => {
  const [noVnc, setNoVnc] = useState(null)
  const [connected, setConnected] = useState(false)
  const { repo, routes, recordingBrowser } = useSelector(
    STORAGE.REPO,
    CATEGORIES.ROUTES,
    CATEGORIES.RECORDING_BROWSER,
  )
  const { isRecording } = recordingBrowser
  
  const onConnected = useCallback(isConnected => {
    setConnected(isConnected)
    !isRecording && isConnected && openAppUrl(repo)
  }, [repo, connected, setConnected, isRecording])

  useEffect(() => {
    import('HKServices/noVncService')
      .then(async ({ NoVncService }) => {
        const containerPort = routes?.screencast?.containerPort
        containerPort
          ? setNoVnc(new NoVncService(onConnected, containerPort))
          : throwMissingPort(routes)
      })
  }, [])

  useEffect(() => {
    noVnc && element && vncUrl && noVnc.init(element, vncUrl, creds)

    return () => noVnc && noVnc.disconnect()
  }, [creds, noVnc, vncUrl, element])

  const { screenRef, screenRect, setScreenRect } = useScreenResize(element)

  return {
    noVnc,
    connected,
    screenRef,
    screenRect,
    setScreenRect,
  }
}
