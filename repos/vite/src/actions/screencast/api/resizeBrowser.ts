
import RFB from '@novnc/novnc/core/rfb'
import { restartBrowser } from '@actions/screencast/api/restartBrowser'
import { ScreencastHeight, ScreencastWidth } from '@constants/screencast'


type TInRFB = RFB & {
  messages: {
    setDesktopSize:(...args:any[]) => void
  }
  _sock?: any
  _screenID?: any
  _screenFlags?: any
}

const GobletRFB = RFB as unknown as TInRFB


export const resizeBrowser = async (
  rfb:RFB
) => {

  const inRFB = rfb as TInRFB

  const parentEl = inRFB._target?.parentElement
  if(!parentEl)
    return console.warn(`NoVNC RFB._target is missing, try reloading the page.`)

  const width = parentEl.offsetWidth
  const height = parentEl.offsetHeight
  const size = { width, height }
  const ratio = width >= height
    ? width / height
    : height / width

  if(height > width){
    size.height = Math.floor(ratio * ScreencastWidth)
    size.width = ScreencastWidth
  }
  else if(height < width){
    size.width = Math.floor(ratio * ScreencastHeight)
    size.height = ScreencastHeight
  }
  

  /**
  * This is a hack to force the screen to the correct size
  * If noVNC || TigerVNC are ever updated, we need to validate this still works
  * RFB._sock / _screenID / _screenFlags are internal methods
  */
  GobletRFB.messages.setDesktopSize(
    inRFB._sock,
    size.width,
    size.height,
    inRFB._screenID,
    inRFB._screenFlags
  )

  // restart the browser context with the correct screen dimensions
  await restartBrowser({
    ...size,
    context: {
      screen: size,
      viewport: size
    }
  })

}