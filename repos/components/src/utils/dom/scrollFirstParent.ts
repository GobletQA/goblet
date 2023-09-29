const regex = /(auto|scroll)/

const hasScroll = (element:HTMLElement) => {
  const style = getComputedStyle(element, null)
  return regex.test(
    style.getPropertyValue(`overflow`)
      + style.getPropertyValue(`overflow-y`)
      + style.getPropertyValue(`overflow-x`)
  )
}

export const scrollFirstParent = (element:HTMLElement|null):HTMLElement => {
  return !element || element === document.body
  ? document.body
  : hasScroll(element)
    ? element
    : scrollFirstParent(element.parentElement)
}

