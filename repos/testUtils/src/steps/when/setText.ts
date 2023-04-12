import type { TWorldConfig } from '@ltipton/parkin'

import { When } from '@GTU/Parkin'
import { get } from '@keg-hub/jsutils'
import { getPage } from '@GTU/Playwright'
import { ExpressionKinds, ExpressionTypes } from '@gobletqa/shared/constants'

/**
 * Sets the input text of selector to data
 * @param {string} selector - valid playwright selector
 * @param {string} data - set selector text to `data`
 * @param {Object} world
 */
export const setText = async (
  selector:string,
  data:string,
  world:TWorldConfig
) => {
  const page = await getPage()
  // Actionability checks (Auto-Waiting) seem to fail in headless mode
  // So we use locator.waitFor to ensure the element exist on the dom
  // Then pass {force: true} options to page.click because we know it exists
  const element = await page.locator(selector)
  await element.waitFor()
  await page.click(selector, {
    force: true
  })

  //clear value before setting otherwise data is appended to end of existing value
  await page.fill(selector, '')

  const [_, ...worldVar] = data.split('.')
  const parsed = get(world, worldVar)
  const rtnData = !data.startsWith(`$world`) ? data : parsed

  await page.type(selector, rtnData)
}

const meta = {
  name: `Set text`,
  alias: [],
  module: `setText`,
  examples: [
    `When I set the element "input[name=email]" text to "my.name@company.com"`
  ],
  description: `Locates input element by selector and replaces existing value, if any, to the desired text.`,
  expressions: [
    {
      type: ExpressionTypes.string,
      kind: ExpressionKinds.element,
      description: `The selector for a single input element.`,
      example: `#search`,
    },
    {
      type: ExpressionTypes.string,
      kind: ExpressionKinds.text,
      description: `Desired text of the element.`,
      example: `I desire to type this text.`,
    },
  ],
  race: true
}

When(`I set {string} to {string}`, setText, meta)
When(`I set the element {string} text to {string}`, setText, {
  ...meta,
  race: false
})

