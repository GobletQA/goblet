/**
 * **IMPORTANT** - This script must run before client code
 * It overrides the default `EventTarget.prototype.addEventListener`
 * Which allows us to capture all events even when `preventDefault` / `stopPropitiation` are called
 */

console.log(`Goblet mouse-hover init`)

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
    console.log(`Goblet on mouse-move listener`)
    window.addEventListener('mousemove', onMouseHover)
    return () => window.removeEventListener('mousemove', onMouseHover)
  }
  catch(err){
    window.removeEventListener('mousemove', onMouseHover)
  }
}

const findTarget = (element, options) => {
  if(!options || !options.selectorRef) return element

  const selectorRef = options.selectorRef
  const search = Array.isArray(selectorRef) ? selectorRef.join(`, `) : selectorRef

  return element.querySelector(search)
    || element.closest(search)
    || element

}

const elementSelectEvent = (options, e) => {

  options = options || {}

  if(options.disabledEvents !== false){
    e.stopPropagation()
    e.preventDefault()
    e.stopImmediatePropagation()
  }

  const target = findTarget(e.target, options)

  const event = {
    type: e.type,
    target: window.__gobletFindCssSelector(target, options),
  }

  if(exists(target.value)) event.value = target.value

  if(exists(target.type)) event.elementType = target.type
  if(exists(target.tagName)) event.elementTag = target.tagName.toLowerCase()

  if(event.elementType === `checkbox` || event.elementType === `radio`)
    event.elementChecked = target.checked
  
  if(event.elementType === 'select'){
    event.selectedIndex = target.selectedIndex
    event.selectedText = target[event.selectedIndex].text
  }

  // if(exists(target.outerHTML)) event.elementHtml = target.outerHTML

  if(exists(target.innerText))
    event.elementText = (target.textContent || ``).substring(0, 300)

  window.onGobletSelectAction(event)
}


const initElementHover = async () => {
  if(window.__gobletElementSelectOn) return

  console.log(`Goblet start initElementHover`)
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

  console.log(`Goblet finish initElementHover`)
}


initElementHover()