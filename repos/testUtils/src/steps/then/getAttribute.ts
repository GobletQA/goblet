import type { TWorldConfig } from '@ltipton/parkin'

import { Then } from '@GTU/Parkin'
import { getPage } from '@GTU/Playwright'
import { ExpressionKinds, ExpressionTypes } from '@gobletqa/shared/constants'

/**
 * Checks that element, matching `selector`, has an attribute matching `attribute`, and that the value of the attribute matches `value`
 * @param {string} selector - valid playwright selector
 * @param {string} attribute - the selector's attribute
 * @param {string} value - the expected value of the selector's attribute
 */
export const getAttribute = async (
  selector:string,
  attribute:string,
  value:string,
  world:TWorldConfig
) => {
  const page = await getPage()

  let attVal = await page.getAttribute(selector, attribute).then(val => {
    return val
  })

  //use-case 01 : validate state of pagination arrows on first page load when there are multiple pages of data

  //on load pagination back arrow has disabled attribute, this is disabled = true
  //returns type of string
  //value of string is empty (not null)
  if (typeof attVal === 'string' && attVal.length === 0) {
    attVal = 'true'
  }

  //on load pagination forward arrow does not have the disabled attribute, this is disabled = false
  //returns type of object
  //value of object is null (this is because 'disabled' attribute doesn't have a value assigned - if attribute had value assigned the value would be returned)
  if (typeof attVal === 'object' && attVal === null) {
    attVal = 'false'
  }

  expect(attVal).toEqual(value)
}

Then('the element {string} attribute {string} is {string}', getAttribute, {
  name: `Check Attribute`,
  alias: [
    `Validate Attribute`,
    `Get Attribute`
  ],
  module: `getAttribute`,
  description: `Locates element by selector and verifies the expected attribute value.`,
  expressions: [
    {
      type: ExpressionTypes.string,
      kind: ExpressionKinds.element,
      description: `The element selector.`,
      example: 'button.pageBackward',
    },
    {
      type: ExpressionTypes.string,
      kind: ExpressionKinds.attribute,
      description: `The element attribute.`,
      example: `disabled`,
    },
    {
      kind: ExpressionKinds.boolean,
      type: ExpressionTypes.boolean,
      description: `The expected attribute value.`,
      example: `true`,
    },
  ],
  race: true
})

