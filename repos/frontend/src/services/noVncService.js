import RFB from '@novnc/novnc/core/rfb'
import { noOpObj, noOp } from '@keg-hub/jsutils'
import KeyTable from '@novnc/novnc/core/input/keysym'
import { statusBrowser } from 'HKActions/screencast/api/statusBrowser'

/**
 * Check if the instance content has updated
 * @param {Object} instance - Current instance of NoVncService
 * @param {Object} element - Dom element the VNC canvas is attached to
 * @param {string} url - The url used to connect to the websocket server
 * @param {Object} creds - Credentials for connecting to the VNC websocket server
 *
 * @return {boolean} - True if the instance properties have changed
 */
const noUpdate = (instance, element, url, creds) => {
  return (
    instance.element === element &&
    instance.url === url &&
    instance.creds === creds
  )
}

const missingConnectProp = (instance) => {
  return [ `element`, `url`, `scPort` ].map(prop => {
    if(instance[prop]) return true
    console.error(`The NoVncService instance is missing property ${prop}`, instance)
    return false
  }).includes(false)
}

export class NoVncService {
  url = null
  element = null
  creds = noOpObj
  isConnected = null
  scPort = undefined
  setConnected = noOp

  constructor(setConnected, scPort) {
    this.scPort = scPort
    this.setConnected = setConnected
  }

  updateConnected = status => {
    this.isConnected = status
    this.setConnected(status)
  }

  onConnect = evt => {
    this.updateConnected(true)
  }

  onDisconnect = evt => {
    if (!this.isConnected) return

    this.updateConnected(false)

    // On Disconnect, try to restart the browser
    setTimeout(async () => {
      await statusBrowser()
      this.connect()
    }, 2000)
  }

  onCopy = () => {}

  onKeyDown = () => {}

  connect = () => {
    if(this.connected || missingConnectProp(this)) return

    // The Caddy proxy looks for the containerPort to know how to redirect the request
    const rfb = new RFB(this.element, `${this.url}?containerPort=${this.scPort}`, {
      credentials: { ...this.creds },
      wsProtocols: ['binary', 'base64'],
    })

    this._rfb = rfb
    rfb.scaleViewport = true
    rfb.background = `#FFFFFF`
    rfb.addEventListener('clipboard', this.onCopy)
    rfb.addEventListener('connect', this.onConnect)
    rfb.addEventListener('disconnect', this.onDisconnect)

    // TODO: Investigate adding a listeners for errors
    // If not available, try to use the onDisconnect
    // rfb._canvas.addEventListener("keydown", this.onKeyDown, true)
  }

  init(element, url, creds) {
    if (noUpdate(this, element, url, creds)) return

    element && (this.element = element)
    url && (this.url = url)
    creds && (this.creds = creds)

    return this.connect()
  }

  reload() {
    if (!this._rfb) return

    this._rfb.scaleViewport = false
    this._rfb.scaleViewport = true
  }

  disconnect() {
    this.onDisconnect()
  }
}
