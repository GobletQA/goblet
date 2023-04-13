import type { TWorldConfig } from '@ltipton/parkin'

import { When } from '@GTU/Parkin'
import { getPage } from '@GTU/Playwright'
import { saveWorldData, saveWorldLocator } from '@GTU/Support/helpers'
import { ExpressionKinds, ExpressionTypes } from '@gobletqa/shared/constants'

/**
 * Expects the element matching `selector` and selects the option(s) with the label === `data`
 * @param {string} selector - valid playwright selector
 * @param {string} data - selector's option label or value
 */
export const setSelectOption = async (
  selector:string,
  data:string,
  key:string = 'label',
  world:TWorldConfig
) => {
  const page = await getPage()
  
  // Defaults to use label if no 'by' key exists
  const options = data.split(',').map(value => ({ [key]: value }))
  const element = await saveWorldLocator(selector, world)
  const resp = await element.selectOption(options)

  await saveWorldData({ options }, world)

  return resp
}

When(`I set the select {string} to {string} by {string}`, setSelectOption, {
  
  module: `setSelectOption`,
  description: `Locates a select element by selector and selects specified options.  Can specify options by option label or option value.`,
  expressions: [
    {
      type: ExpressionTypes.string,
      kind: ExpressionKinds.element,
      description: `The selector for the select element.  Selector must be specific enough to locate a single element.`,
      example: `select[name='unique_name']`,
    },
    {
      type: ExpressionTypes.string,
      // TODO: add input for tags?
      // kind: ExpressionKinds.tags,
      kind: ExpressionKinds.text,
      description: `Comma delimited list of option(s) to select.  Can be option labels or values.`,
      example: `California, Oregon, Washington`,
    },
    {
      type: ExpressionTypes.string,
      // TODO: add enum for option label || value
      // kind: ExpressionKinds.optionEnum,
      kind: ExpressionKinds.text,
      description: `Valid options are \'label\' or \'value\' only.`,
      example: `value`,
    },
  ],
  race: true
})

