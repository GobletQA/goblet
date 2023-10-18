/**
 * **IMPORTANT** - This script must run before client code
 * It overrides the default `EventTarget.prototype.addEventListener`
 * Which allows us to capture all events even when `preventDefault` / `stopPropitiation` are called
 */

console.log(`[Goblet] - Mouse-Hover Init`)

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
  sides.forEach(side => {
    if(side === `left`)
      highlightEl.style[side] = (rect[side] + window.scrollX) + 'px'

    else if(side === `top`)
      highlightEl.style[side] = (rect[side] + window.scrollY) + 'px'

    else highlightEl.style[side] = rect[side] + 'px'
  })
}

const addListener = (styles) => {
  const onMouseHover = async (event) => hoverHighlighter(event, styles)

  try {
    console.log(`[Goblet] - On mouse move listener`)
    window.addEventListener('mousemove', onMouseHover)
    return () => window.removeEventListener('mousemove', onMouseHover)
  }
  catch(err){
    window.removeEventListener('mousemove', onMouseHover)
  }
}


const elementSelectEvent = (options, e) => {

  options = options || {}

  // TODO: use selector type to choose between selecting text or an css selector
  const selectorType = options.selectorType

  if(options.disabledEvents !== false){
    e.stopPropagation()
    e.preventDefault()
    e.stopImmediatePropagation()
  }

  const event = {
    type: e.type,
    target: window.__gobletFindCssSelector(e.target, options),
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

  // if(exists(e.target.outerHTML)) event.elementHtml = e.target.outerHTML

  if(exists(e.target.innerText))
    event.elementText = (e.target.textContent || ``).substring(0, 300)

  window.onGobletSelectAction(event)
}


const initElementHover = async () => {
  if(initElementHover.init) return
  initElementHover.init = true

  console.log(`[Goblet] - Start initElementHover`)
  
  let removeListener
  let onSelectElement

  window.__gobletElementSelectOn = async (options={}) => {
    // If already set, then make it undefined to allow GC to pick it up
    if(onSelectElement) onSelectElement = undefined

    // Sets a callback method, that is called within the addEventListener override
    // We must rebind the method each time to ensure the updated options are passed in
    onSelectElement = elementSelectEvent.bind(window, options)

    // Remove existing styles
    if(removeListener) removeListener()

    // Update the highlighter styles to be the current styles
    const styles = await window.getGobletHoverOption('highlightStyles')
    removeListener = addListener(styles)

    // Ensure the highlight element can be seen
    if(highlightEl && highlightEl.style) highlightEl.style.display = ``
  }

  window.__gobletElementSelectOff = () => {
    // Turn off the highlight element
    if(highlightEl && highlightEl.style) highlightEl.style.display = `none`

    // Remove any styles if needed
    if(removeListener) removeListener()
    removeListener = undefined
  }

  // Override for adding event listeners
  const oldAddEventListener = EventTarget.prototype.addEventListener
  EventTarget.prototype.addEventListener = function(eventName, eventHandler){
    oldAddEventListener.call(this, eventName, function(event) {
      // Ensure the select method exists, and the event is a click event
      
      // Call the original passed in eventHandler
      removeListener && onSelectElement && eventName === `click`
        ? onSelectElement(event)
        : eventHandler(event)
      
      
    })
  }

  console.log(`[Goblet] - Finish initElementHover`)
}


initElementHover()