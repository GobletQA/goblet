import type { TStepCtx } from '@GTU/Types'

import { When } from '@GTU/Parkin'
import { getLocator } from '@GTU/Playwright'
import { ExpressionKinds, ExpressionTypes } from '@gobletqa/environment/constants'

/**
 * Click the element matching `selector`
 * @param {String} selector - valid playwright selector
 */
export const contextClick = async (
  selector:string,
  ctx:TStepCtx
) => {

  const locator = getLocator(selector)
  /**
   * Based on the element we are interacting with
   * There are times where using a locator in not consistent
   * For example dynamically created menu, with items that only exist when the menu is active
   * This can also happen with select drop downs
   * A good example is in Material UI 
   */
  await locator.evaluate((node) => {
    const clickEvent = new MouseEvent(`click`)
    node.dispatchEvent(clickEvent)
  })

}

const meta = {
  module: `contextClick`,
  name: `Browser context click`,
  examples: [
    `When I click "button[name='unique_name']" in context`,
    `When I click the element "button[name='unique_name']" in context`,
  ],
  description: `Gets the page context, locate an element by selector and click it within the context of the page.\nThere are times finding an element in not consistent due to its dynamic nature. For example a dynamically created drop-down menu, with items that only exist when the menu is active. This common in component libraries such as Material UI.\nIf the test is having issues with clicking an element, using this step could help.`,
  expressions: [
    {
      type: ExpressionTypes.string,
      kind: ExpressionKinds.element,
      description: `The element selector.  Selector must be specific enough to locate a single element.`,
      example: `button[name='unique_name']`,
    },
  ],
  race: true
}

When(`I click {string} in context`, contextClick, meta)
When(`I click the {string} in context`, contextClick, {
  ...meta,
  race: false
})

