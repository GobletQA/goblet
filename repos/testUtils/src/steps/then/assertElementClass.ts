import type { TStepCtx } from '@GTU/Types'

import { Then } from '@GTU/Parkin'
import { getLocator } from '@GTU/Playwright'
import { ExpressionKinds, ExpressionTypes } from '@GTU/Constants'

/**
 * Checks that element, matching `selector`, has an attribute matching `attribute`, and that the value of the attribute matches `value`
 * @param {string} selector - valid playwright selector
 * @param {string} className - Space separated string of classes
 */
export const assertElementClass = async (
  selector:string,
  className:string,
  ctx:TStepCtx
) => {

  const locator = getLocator(selector)
  const classList = await locator.evaluate((node) => ([...node.classList]), {})

  const classes = className.split(` `)
    .filter(cls => Boolean(cls.trim()))
    .map(cls => cls.replace(/^\./, ``))

  expect(classList).toEqual(expect.arrayContaining(classes))
}

Then(`the element {string} to have class {string}`, assertElementClass, {
  name: `Assert Element Class`,
  module: `assertElementClass`,
  alias: [`class`, `className`, `attribute`],
  description: `Locates element by selector, and validates it contains the passed in class. To check multiple classes, separate each class by a space.`,
  expressions: [
    {
      type: ExpressionTypes.string,
      kind: ExpressionKinds.element,
      description: `The element selector.`,
      example: `button.my-button`,
    },
    {
      type: ExpressionTypes.string,
      kind: ExpressionKinds.className,
      description: `The name of the class`,
      example: `my-class`,
    }
  ],
  race: true
})
