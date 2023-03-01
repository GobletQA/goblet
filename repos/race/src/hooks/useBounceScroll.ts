export type THBounceScroll = {
  damping?:number
  maxOffset?:number
  content:HTMLElement
  container:HTMLElement
}

// wheel delta normalizing
// copied from smooth-scrollbar/src/utils/get-delta.js
const DELTA_SCALE:Record<string, number> = {
    STANDARD: 1,
    OTHERS: -3,
}

const DELTA_MODE = [1.0, 28.0, 500.0]

const getDeltaMode = (mode:number) => DELTA_MODE[mode] || DELTA_MODE[0]

const getDelta = (evt:any) => {
  if ('deltaX' in evt) {
    const mode = getDeltaMode(evt.deltaMode)

    return {
      x: evt.deltaX / DELTA_SCALE.STANDARD * mode,
      y: evt.deltaY / DELTA_SCALE.STANDARD * mode,
    }
  }

  if ('wheelDeltaX' in evt) {
    return {
      x: evt.wheelDeltaX / DELTA_SCALE.OTHERS,
      y: evt.wheelDeltaY / DELTA_SCALE.OTHERS,
    }
  }

  // ie with touchpad
  return {
    x: 0,
    y: evt.wheelDelta / DELTA_SCALE.OTHERS,
  }
}

const isOntoEdge = (
  container:HTMLElement,
  delta:number
  ) => {
  const {
    scrollTop,
    scrollHeight,
    clientHeight,
  } = container

  const max = scrollHeight - clientHeight

  return (scrollTop === 0 && delta <= 0)
    || (scrollTop === max && delta >= 0)
}


export const useBounceScroll = (props:THBounceScroll) => {
  // const container = document.querySelector('.container') as HTMLElement
  // const content = document.querySelector('.content') as HTMLElement

  const {
    content,
    container,
    damping = 0.8,
    maxOffset = 100
  } = props

  // states
  let offset = 0
  let rendered = 0
  let lastDis = 0
  let backFlag = false
  let timer:NodeJS.Timeout

  const resetFlag = () => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        backFlag = false
      }, 30)
  }

  const render = () => {
      if (!offset && !rendered) {
        lastDis = 0

        return requestAnimationFrame(render)
      }

      const dis = offset - rendered

      if (lastDis * dis < 0) {
        backFlag = true
      }

      lastDis = dis

      // throw away float part
      const next = offset - (dis * damping | 0)

      content.style.transform = `translate3d(0, ${-next}px, 0)`

      rendered = next
      offset = offset * damping | 0

      requestAnimationFrame(render)
  }

  render()

  // wheel events handler
  ;[
    'wheel',
    'mousewheel'
  ].forEach(name => {
    container.addEventListener(name, evt => {
      const { y } = getDelta(evt)

      // check if scrolling onto very edge
      if (!isOntoEdge(container, y)) {
        return
      }

      resetFlag()
      evt.preventDefault()

      if (!backFlag && y) {
        offset += y * (maxOffset - Math.abs(offset)) / maxOffset
      }
    })
  })
}
