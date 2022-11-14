import { getData } from '../getData'

export const HorizontalTouchCoordinate = (callback:any) => {
  const options = getData(callback)
  return null === options ? null : window.scrollX + options.clientX
}

export const HorizontalMouseCoordinate = (e:any) => {
  return window.scrollX + e.clientX
}

export const HorizontalKeyboardCoordinate = (event:any) => {
  var e = event.target
  if (!(e instanceof Element)) {
    return null
  }
  var x = window.scrollX + e.getBoundingClientRect().x
  if (!(event instanceof KeyboardEvent)) {
    return x
  }
  switch(event.key) {
    case "ArrowLeft":
      return event.shiftKey ? 0 : x - 5
    case "ArrowRight":
      return event.shiftKey ? document.body.scrollWidth : x + 5
    default:
      return null
  }
}



