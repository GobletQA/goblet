console.log(`------- GOBLET - MOUSE-HOVER INIT -------`)

/**
 * Element used to highlight other elements hovered by the mouse
 */
let highlightEl

/**
 * All sides of a rect to set the highlightEl size
 * @type {Array}
 */
const sides = ['top', 'left', 'width', 'height']


/**
 * Helper to check if a value exists
 * @type {Function}
 * @param {*} value - To be checked if it exists
 *
 */
const exists = (value) => {
  return (value !== undefined && value !== null && !Number.isNaN(value))
}


/**
 * Highlights the element on the dom that is currently hovered by the mouse pointer
 * Listens to the mousemove event
 * @param {Object} e - Dom event fired from an event listener
 */
const hoverHighlighter = (event, styles) => {
  if (!highlightEl) {

    highlightEl = document.createElement('div')

    Object.keys(styles).forEach(key => highlightEl.style[key] = styles[key])
    document.body.appendChild(highlightEl)
  }

  const rect = event.target.getBoundingClientRect()
  sides.forEach(side => highlightEl.style[side] = rect[side] + 'px')
}

const addListener = (styles) => {
  const onMouseHover = async (event) => hoverHighlighter(event, styles)

  try {
    console.log(`------- on mouse move list -------`)
    window.addEventListener('mousemove', onMouseHover)
    return () => window.removeEventListener('mousemove', onMouseHover)
  }
  catch(err){
    window.removeEventListener('mousemove', onMouseHover)
  }
}


const elementSelectEvent = (e) => {

  e.stopPropagation()
  e.preventDefault()
  
  const event = {
    type: e.type,
    target: window.__gobletFindCssSelector(e.target),
  }

  if(exists(e.target.value)) event.value = e.target.value

  if(exists(e.target.type)) event.elementType = e.target.type
  if(exists(e.target.tagName)) event.elementTag = e.target.tagName.toLowerCase()

  if(event.elementType === 'checkbox' || event.elementType === 'radio')
    event.elementChecked = e.target.checked
  
  if(event.elementType === 'select'){
    event.selectedIndex = e.target.selectedIndex
    event.selectedText = e.target[event.selectedIndex].text
  }

  console.log(e.target.outerHTML)

  if(exists(e.target.outerHTML)) event.elementHtml = e.target.outerHTML

  window.onGobletSelectAction(event)
}


const initElementHover = async () => {
  console.log(`------- Start initElementHover -------`)
  
  let removeListener

  window.__gobletElementSelectOn = async () => {
    console.log(`------- __gobletElementSelectOn -------`)

    if(removeListener) removeListener()

    const styles = await window.getGobletHoverOption('highlightStyles')
    removeListener = addListener(styles)

    if(highlightEl && highlightEl.style) highlightEl.style.display = ``

    window.addEventListener(`click`, elementSelectEvent)
  }

  window.__gobletElementSelectOff = () => {
    console.log(`------- __gobletElementSelectOff -------`)
    highlightEl.style.display = `none`
    window.removeEventListener(`click`, elementSelectEvent)

    if(removeListener) removeListener()
    removeListener = undefined
  }

  console.log(`------- Finish initElementHover -------`)
}

initElementHover()