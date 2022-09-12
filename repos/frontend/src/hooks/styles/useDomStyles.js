import { useMemo } from 'react'
import { Values } from 'GBConstants'
import { useStyle } from '@keg-hub/re-theme'
import { noOpObj, isStr, checkCall } from '@keg-hub/jsutils'
import { createDomNode } from 'GBUtils/helpers/createDomNode'
import { convertToCss } from '@keg-hub/re-theme/styleInjector'

let DomStyleSheet
let stylesAdded = false
const { DOM_STYLES_ID } = Values
const isProduction = process.env.NODE_ENV === 'production'

/**
 * Helper hook to added CSS styles to a Stylesheet on the dom
 * Uses convertToCss helper from re-theme in a no-standard fashion
 * @type function
 *
 * @returns {void}
 */
export const useDomStyles = (styles = noOpObj) => {
  const globalStyles = useStyle('global', `domStyles`, styles)

  return useMemo(() => {
    if (stylesAdded) return stylesAdded
    stylesAdded = true

    DomStyleSheet =
      DomStyleSheet || document.head.querySelector(`#${DOM_STYLES_ID}`)

    DomStyleSheet &&
      Object.entries(globalStyles).map(([selector, rules]) => {
        const validCssStr = selector[0] === '$' && isStr(rules)
          ? rules
          : checkCall(() => {
              const { blocks } = convertToCss(rules, noOpObj)
              // Blocks should always be an array with max length of 1
              // So we can treat it as a string here
              return blocks.length && `${selector}${blocks}`
            })

        validCssStr &&
          (isProduction
            ? DomStyleSheet.sheet.insertRule(`@media all {${validCssStr}}`)
            : (DomStyleSheet.textContent = `${DomStyleSheet.textContent}\n${validCssStr}`))
      })
  }, [])
}

/**
 * Helper to auto-add the ace editor style overrides
 */
;(() => createDomNode(DOM_STYLES_ID, 'style', 'head'))()
