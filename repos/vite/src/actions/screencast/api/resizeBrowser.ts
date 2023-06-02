import RFB from '@novnc/novnc/core/rfb'
import { pageService } from '@services/pageService'
import { calcPageSize } from '@utils/browser/calcPageSize'


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
  const size = calcPageSize(inRFB)

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

  await pageService.resize({
    ...size,
    // Not sure why, but 10px from the bottom of the browser seem to get cutoff
    // So we make the browser 10px smaller to ensure the whole browser displays
    height: size.height - 10
  })

}