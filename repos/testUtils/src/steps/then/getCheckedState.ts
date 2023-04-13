import type { TWorldConfig } from '@ltipton/parkin'

import { Then } from '@GTU/Parkin'
import { getLocator } from '@GTU/Playwright'
import { ExpressionKinds, ExpressionTypes } from '@gobletqa/shared/constants'

const checkedStates = ['checked', 'unchecked']

/**
 * Checks the element matching the selector
 * @param {String} selector - valid playwright selector
 * @param {string} state - valid state options are `checked` or `unchecked`
 */
export const getCheckedState = async (
  selector:string,
  state:string,
  world:TWorldConfig
) => {
  if (!checkedStates.includes(state))
    throw new Error('Invalid Check State: ' + state)

  const box = await getLocator(selector)
  const checkedState = await box.isChecked() //boolean
  const stateConversion = state === 'checked' ? true : false
  if (stateConversion !== checkedState) {
    throw new Error(
      'Element checked state is ' +
        checkedState +
        ' but expected check state is ' +
        stateConversion
    )
  }

  return checkedState
}

Then(
  `the element {string} checked state is {string}`,
    getCheckedState,
  {
    name: `Is Checked`,
    alias: [`Checked`, `Clicked`, `Unchecked`],
    module: `getCheckedState`,
    description: `Locates a checkbox element by selector and verifies its checked state, checked or unchecked.`,
    expressions: [
      {
        type: ExpressionTypes.string,
        kind: ExpressionKinds.element,
        description: `The selector for the checkbox.  Selector must be specific enough to locate a single element.`,
        example: `input[name='unique_name']`,
      },
      {
        type: ExpressionTypes.string,
        // TODO: check kind should be `check` || `uncheck`
        kind: ExpressionKinds.check,
        description: `Valid options are \'checked\' or \'uncheck\' only.`,
        example: `checked`,
      },
    ],
    race: true
  }
)
