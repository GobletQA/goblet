import type { TStepCtx } from '@GTU/Types'

import { When } from '@GTU/Parkin'
import { saveWorldData, saveWorldLocator } from '@GTU/Support/helpers'
import {
  ExpressionKinds,
  ExpressionTypes,
  ExpressionElements
} from '@gobletqa/environment/constants'

/**
 * Expects the element matching `selector` and selects the option(s) with the label === `data`
 * @param {string} selector - valid playwright selector
 * @param {string} data - selector's option label or value
 */
export const setSelectOption = async (
  selector:string,
  data:string,
  key:string,
  ctx:TStepCtx
) => {
  const { world } = ctx
  const options = data.split(',').map(value => ({ [key]: value }))
  const element = await saveWorldLocator({ selector, world }, ctx)
  const resp = await element.selectOption(options)

  await saveWorldData({ options }, world)

  return resp
}

When(`I set the select {string} to {string} by {string}`, setSelectOption, {
  name: `Select by value or label`,
  module: `setSelectOption`,
  description: `Locates a native HTML select element by selector and selects specified options. Can specify the option to select by label (option text) or value attribute.`,
  expressions: [
    {
      type: ExpressionTypes.string,
      kind: ExpressionKinds.element,
      kindRef: ExpressionElements.select,
      description: `The selector for the native HTML select element.`,
      example: `select[name='unique_name']`,
    },
    {
      type: ExpressionTypes.string,
      // TODO: add input for tags?
      // kind: ExpressionKinds.tags,
      kind: ExpressionKinds.text,
      description: `Comma delimited list of option(s) to select. Can be option labels or values.`,
      example: `California, Oregon, Washington`,
    },
    {
      options: [`value`, `label`],
      type: ExpressionTypes.string,
      kind: ExpressionKinds.options,
      description: `How to identify the option to select, by label (option text) or value attribute.`,
      example: `value`,
    },
  ],
  race: true,
  autoSaveLocator: true,
})

