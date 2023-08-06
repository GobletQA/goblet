import type { TStepCtx } from '@GTU/Types'

import { Then } from '@GTU/Parkin'
import { getPage } from '@GTU/Playwright'
import { ExpressionKinds, ExpressionTypes } from '@GTU/Constants'

/**
 * Checks that element, matching `selector`, has an attribute matching `attribute`, and that the value of the attribute matches `value`
 * @param {string} selector - valid playwright selector
 * @param {string} attribute - the selector's attribute
 * @param {string} value - the expected value of the selector's attribute
 */
export const assertStyleValue = async (
  selector:string,
  rule:string,
  value:string,
  ctx:TStepCtx
) => {

  const page = await getPage()

  const locator = page.locator(selector)
  const val = await locator.evaluate((node, { rule, value }) => {
    const nVal = node.style[rule]
    if(nVal === value) return nVal

    const computed = getComputedStyle(node)

    return computed[rule]
  }, { rule, value })

  expect(val).toEqual(value)
}

Then(`the element {string} style {string} is {string}`, assertStyleValue, {
  name: `Assert Element Style`,
  alias: [],
  module: `assertStyleValue`,
  description: `Locates element by selector, and validates that a style rule matches the expected value`,
  expressions: [
    {
      type: ExpressionTypes.string,
      kind: ExpressionKinds.element,
      description: `The element selector.`,
      example: `button.my-button`,
    },
    {
      type: ExpressionTypes.string,
      kind: ExpressionKinds.style,
      description: `The element style rule name.`,
      example: `display`,
    },
    {
      kind: ExpressionKinds.boolean,
      type: ExpressionTypes.boolean,
      description: `The expected style rule value.`,
      example: `none`,
    },
  ],
  race: true
})
