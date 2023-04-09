import type { TWorldConfig } from '@ltipton/parkin'

import { When } from '@GTU/Parkin'
import { getPage, getLocatorByText } from '@GTU/Playwright'
import { ExpressionKinds, ExpressionTypes } from '@gobletqa/shared/constants'

/**
 * Click the element matching `selector`
 * @param {String} selector - valid playwright selector
 */
export const clickTextHandler = async (selector:string, world:TWorldConfig) => {
  const page = await getPage()
  // Actionability checks (Auto-Waiting) seem to fail in headless mode
  // So we use locator.waitFor to ensure the element exist on the dom
  const locator = await getLocatorByText(selector, { page, waitFor: true })

  // Then pass {force: true} options to locator.click because we know it exists
  return locator.click({ force: true })
}

const meta = {
  module: `clickText`,
  examples: [
    `When I click text "Submit Form"`,
    `When I click the text "Submit Form"`,
  ],
  description: `Locates an element by text and clicks it.`,
  expressions: [
    {
      type: ExpressionTypes.string,
      kind: ExpressionKinds.text,
      description: `The text content of an element that should be clicked that exists on the page`,
      example: `Submit Form`,
    },
  ],
}

When(`I click text {string}`, clickTextHandler, {
  ...meta,
  name: `Click text`,
  alias: [`Touch`, `Press`],
  info: `Action to simulate clicking, touching, or pressing an element on the page`,
  race: true
})
When(`I click the text {string}`, clickTextHandler, meta)
