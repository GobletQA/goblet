import type { TWorldConfig } from '@ltipton/parkin'

import { When } from '@GTU/Parkin'
import { getPage, getLocator } from '@GTU/Playwright'
import { ExpressionKinds, ExpressionTypes } from '@gobletqa/shared/constants'

/**
 * Click the element matching `selector`
 * @param {String} selector - valid playwright selector
 */
export const clickElementHandler = async (
  selector:string,
  world:TWorldConfig
) => {
  const page = await getPage()
  // Actionability checks (Auto-Waiting) seem to fail in headless mode
  // So we use locator.waitFor to ensure the element exist on the dom
  // Then pass {force: true} options to page.click because we know it exists
  await getLocator(selector)
  return page.click(selector, {
    force: true
  })
}


const meta = {
  module: `clickElement`,
  examples: [
    `When I click "button[name='unique_name']"`,
    `When I click the element "button[name='unique_name']"`,
  ],
  description: `Locates an element by selector and clicks it.`,
  expressions: [
    {
      type: ExpressionTypes.string,
      kind: ExpressionKinds.selector,
      description: `The selector of an element that exists on the page`,
      example: "button[name='btn-name']",
    },
  ],
}

When('I click {string}', clickElementHandler, {
  ...meta,
  name: `Click page element`,
  alias: [`Touch`, `Press`],
  info: `Action to simulate clicking, touching, or pressing an element on the page`,
  race: true
})
When('I click the {string}', clickElementHandler, meta)
When('I click the element {string}', clickElementHandler, meta)
When('I click the page', async (world:TWorldConfig) => await clickElementHandler(`body`, world), {
  ...meta,
  expressions: [],
  examples: [`When I click the page`],
})
