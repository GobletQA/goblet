import type { TStepCtx } from '@GTU/Types'

import { When } from '@GTU/Parkin'
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
 * Ensures the element state matches the passed in state
 * @param {String} selector - valid playwright selector
 * @param {string} state - valid state options are `checked` or `unchecked`
 */
export const ensureCheckedState = async (
  selector:string,
  state:string,
  ctx:TStepCtx
) => {

  // Validate checked || unchecked was passed
  expect(checkedStates).toEqual(expect.arrayContaining([state]));

  const input = await getLocator(selector)
  const checkedState = await input.isChecked() // boolean
  const stateConversion = Boolean(state === checkedStates.checked)

  // State is correct, so just return
  if(stateConversion === checkedState) return

  // In the wrong state, so set it to the state
  return await input.setChecked(stateConversion)
}

const meta = {
  name: `Ensure checkbox is checked or unchecked`,
  alias: [`Checked`, `Clicked`, `Unchecked`],
  module: `ensureCheckedState`,
  description: `Locates a checkbox element by selector and ensures its state is checked or unchecked.`,
  expressions: [
    {
      type: ExpressionTypes.string,
      kind: ExpressionKinds.element,
      description: `The selector for the checkbox.`,
      example: `input[name='my-checkbox']`,
    },
    {
      options: checkedStates,
      type: ExpressionTypes.string,
      kind: ExpressionKinds.options,
      example: checkedStates.checked,
      description: `State that the checkbox should be in`,
    },
  ],
}

When(`I ensure the checkbox {string} state is {string}`, ensureCheckedState, meta)
