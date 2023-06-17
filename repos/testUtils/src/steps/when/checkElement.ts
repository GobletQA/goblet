import type { TStepCtx } from '@GTU/Types'

import { When } from '@GTU/Parkin'
import { getLocator } from '@GTU/Playwright'
import { ExpressionKinds, ExpressionTypes } from '@gobletqa/shared/constants'

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
  const box = await getLocator(selector)
  const boxAction = action === 'check' ? await box.check() : await box.uncheck()
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
      // TODO: check kind should be `check` || `uncheck`
      kind: ExpressionKinds.check,
      type: ExpressionTypes.string,
      description: `Valid options are \'check\' or \'uncheck\' only.`,
      example: 'check',
    },
    {
      // TODO: Should set different element types that can be selected
      // In this case only radio and checkboxes
      // kind: ExpressionKinds.checkbox,
      kind: ExpressionKinds.element,
      type: ExpressionTypes.string,
      description: `The element selector. Selector must be specific enough to locate a single element.  Valid for checkbox and radio inputs.`,
      example: `input[name='unique_name']`,
    },
  ],
  race: true
}

When(`I {string} the element {string}`, checkElement, meta)

