import RFB from '@novnc/novnc/core/rfb'
import { ScreencastHeight, ScreencastWidth } from '@constants/screencast'

export const calcPageSize = (
  rfb:RFB|null
) => {

  const parentEl = rfb?._target?.parentElement
  if(!parentEl){
    console.warn(`NoVNC RFB._target is missing, try reloading the page.`)

    return {
      width: ScreencastWidth,
      height: ScreencastHeight
    }
  }

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

  return size
}
