import type { TStepCtx } from '@GTU/Types'

import { When } from '@GTU/Parkin'
import { getLocator } from '@GTU/Playwright'
import { getLocatorTimeout } from '@GTU/Support'
import { ExpressionElements, ExpressionKinds, ExpressionTypes } from '@gobletqa/environment/constants'

const checkOpts = [
  `check`,
  `uncheck`
]

/**
 * Checks/unchecks the element matching the selector
 * @param {String} action - check action
 * @param {String} selector - playwright selector string
 */
export const checkElement = async (
  action:string,
  selector:string,
  ctx:TStepCtx
) => {
  const timeout = getLocatorTimeout(ctx)
  const box = getLocator(selector)
  const boxAction = action === `check` ? await box.check({ timeout }) : await box.uncheck({ timeout })
}

const meta = {
  name: `Select the input`,
  alias: [`radio`, `check`, `checkbox`],
  module: `checkElement`,
  description: `Locates a checkbox or radio element by selector and either checks or unchecks it.`,
  examples: [
    `I "check" the element "input[name=\'unique_name\']"`,
  ],
  expressions: [
    {
      example: `check`,
      options: checkOpts,
      kind: ExpressionKinds.options,
      type: ExpressionTypes.string,
      description: `Valid options are \'check\' or \'uncheck\' only.`,
    },
    {
      kind: ExpressionKinds.element,
      type: ExpressionTypes.string,
      kindRef: ExpressionElements.inputCheck,
      description: `The element selector. Selector must be specific enough to locate a single element.  Valid for checkbox and radio inputs.`,
      example: `input[name='unique_name']`,
    },
  ],
  race: true
}

When(`I {string} the element {string}`, checkElement, meta)

