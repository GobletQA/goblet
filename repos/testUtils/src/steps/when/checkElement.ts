import type { TWorldConfig } from '@ltipton/parkin'

import { When } from '@GTU/Parkin'
import { getLocator } from '@GTU/Playwright'

/**
 * Checks/unchecks the element matching the selector
 * @param {String} action - check action
 * @param {String} selector - playwright selector string
 */
export const checkElement = async (
  action:string,
  selector:string,
  world:TWorldConfig
) => {
  const box = await getLocator(selector)
  const boxAction = action === 'check' ? await box.check() : await box.uncheck()
}

const meta = {
  module: `checkElement`,
  description: `Locates a checkbox or radio element by selector and either checks or unchecks it.`,
  examples: [
    `I "check" the element "input[name=\'unique_name\']"`,
  ],
  expressions: [
    {
      type: 'string',
      description: `Valid options are \'check\' or \'uncheck\' only.`,
      example: 'check',
    },
    {
      type: 'string',
      description: `The element selector.  Selector must be specific enough to locate a single element.  Valid for checkbox and radio inputs.`,
      example: "input[name='unique_name']",
    },
  ],
}

When(`I {string} the element {string}`, checkElement, meta)
