import { getData } from '../getData'

export const VerticalTouchCoordinate = (event:any) => {
  const options = getData(event)
  return null === options ? null : window.scrollY + options.clientY
}

export const VerticalMouseCoordinate = (options:any) => {
  return window.scrollY + options.clientY
}

export const VerticalKeyboardCoordinate = (event:any) => {
  var e = event.target
  if (!(e instanceof Element)) {
    return null
  }
  var x = window.scrollY + e.getBoundingClientRect().y
  if (!(event instanceof KeyboardEvent)) {
    return x
  }
  switch(event.key) {
    case "ArrowUp":
      return event.shiftKey ? 0 : x - 5
    case "ArrowDown":
      return event.shiftKey ? document.body.scrollHeight : x + 5
    default:
      return null
  }
}