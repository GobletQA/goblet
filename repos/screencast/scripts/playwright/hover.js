

/**
 * Element used to highlight other elements hovered by the mouse
 */
let highlightEl
let hoverIsActive = true

/**
 * All sides of a rect to set the highlightEl size
 * @type {Array}
 */
const sides = ['top', 'left', 'width', 'height']

/**
 * Highlights the element on the dom that is currently hovered by the mouse pointer
 * Listens to the mousemove event
 * @param {Object} e - Dom event fired from an event listener
 */
const hoverHighlighter = (event, styles) => {
  if(!hoverIsActive) return

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
    window.addEventListener('mousemove', onMouseHover)
    return () => window.removeEventListener('mousemove', onMouseHover)
  }
  catch(err){
    window.removeEventListener('mousemove', onMouseHover)
  }
}

const initElementHover = async () => {
  console.log(`------- Start initElementHover -------`)
  const styles = await window.getGobletHoverOption('highlightStyles')
  const removeListener = addListener(styles)

  window.__gobletRemoveHoverListen = () => { removeListener() }
  window.__gobletToggleHoveActive = () => { hoverIsActive = !hoverIsActive }

  console.log(`------- Finish initElementHover -------`)
}

initElementHover()