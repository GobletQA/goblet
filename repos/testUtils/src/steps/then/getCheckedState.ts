import type { TStepCtx } from '@GTU/Types'

import { Then } from '@GTU/Parkin'
import { getLocator } from '@GTU/Playwright'
import { ExpressionKinds, ExpressionTypes } from '@gobletqa/shared/constants'

type TCheckStates = [`checked`, `unchecked`] & {
  checked?: `checked`,
  unchecked?: `unchecked`
}

const checkedStates:TCheckStates = [`checked`, `unchecked`]
checkedStates.checked = checkedStates[0]
checkedStates.unchecked = checkedStates[1]

/**
 * Checks the element matching the selector
 * @param {String} selector - valid playwright selector
 * @param {string} state - valid state options are `checked` or `unchecked`
 */
export const getCheckedState = async (
  selector:string,
  state:string,
  ctx:TStepCtx
) => {

  // Validate checked || unchecked was passed
  expect(checkedStates).toEqual(expect.arrayContaining([state]));

  const input = await getLocator(selector)
  const checkedState = await input.isChecked() // boolean
  const stateConversion = state === `checked` ? true : false

  expect(stateConversion).toEqual(checkedState)

  return checkedState
}

const meta = {
  name: `Is Checked or Unchecked`,
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
      example: `checked`,
      options: checkedStates,
      kind: ExpressionKinds.check,
      type: ExpressionTypes.string,
      description: `Valid options are 'checked' or 'uncheck' only.`,
    },
  ],
}

Then(`the element {string} checked state is {string}`, getCheckedState, meta)


Then(
  `the {string} to be checked`,
  (selector:string, ctx:TStepCtx) => getCheckedState(selector, checkedStates.checked, ctx),
  {
    ...meta,
    race: true,
    name: `Is Checked`,
    expressions: [meta.expressions[0]],
    description: `Locates a checkbox element by selector and verifies it is checked.`,
  }
)

Then(
  `the {string} to be unchecked`,
  (selector:string, ctx:TStepCtx) => getCheckedState(selector, checkedStates.unchecked, ctx),
  {
    ...meta,
    race: true,
    name: `Is Unchecked`,
    expressions: [meta.expressions[0]],
    description: `Locates a checkbox element by selector and verifies it is unchecked.`,
  }
)