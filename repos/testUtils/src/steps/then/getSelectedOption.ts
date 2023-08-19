import type { TStepCtx } from '@GTU/Types'

import { Then } from '@GTU/Parkin'
import { getPage } from '@GTU/Playwright'
import { ExpressionKinds, ExpressionTypes } from '@GTU/Constants'

/**
 * Expects the element matching `selector` and verifies selected options === `data`
 * @param {string} selector - valid playwright selector
 * @param {string} data - selector's option label or value
 * @param {string} key - key to validate
 */
export const getSelectedOption = async (
  selector:string,
  data:string,
  key:string,
  ctx:TStepCtx
) => {
  const page = await getPage()

  const selectedLabels = await page.$eval(
    selector,
    (el:HTMLSelectElement, key:string) => {
      const options = Array.from(el.selectedOptions)
      return options.map(option => option[key])
    },
    key
  )

  data.split(',').map(label => {
    expect(selectedLabels.includes(label)).toBe(true)
  })
}

//this step calls the function this way, as opposed to the step below, because there is no 3rd argument so it's injecting world object and where label should be
// Then('the select {string} selected option(s) is/are {string}', (selector,data,ctx) => {
//   return getSelectedOption(selector,data,'label',ctx)
// })

Then(
  `the select {string} selected option(s) is/are {string} by {string}`,
  getSelectedOption,
  {
    name: `Selected Options`,
    alias: [`Selected`, `Options`],
    module: `getSelectedOption`,
    description: `Locates a select element by selector and verifies its selected options.  Can verify options by option label or option value.`,
    expressions: [
      {
      // TODO: Should set different element types that can be selected
      // In this case only select
        kind: ExpressionKinds.element,
        type: ExpressionTypes.string,
        description: `The selector for the select element.  Selector must be specific enough to locate a single element.`,
        example: `select[name='unique_name']`,
      },
      {
        kind: ExpressionKinds.text,
        type: ExpressionTypes.string,
        description: `Comma delimited list of expected selected option(s).  Can be option labels or values.`,
        example: `California, Oregon, Washington`,
      },
      {
        kind: ExpressionKinds.text,
        type: ExpressionTypes.string,
        description: `Valid options are \'label\' or \'value\' only.`,
        example: `value`,
      },
    ],
    race: true
  }
)
