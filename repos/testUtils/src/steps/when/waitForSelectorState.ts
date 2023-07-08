import type { TStepCtx } from '@GTU/Types'

import { When } from '@GTU/Parkin'
import { getLocator } from '@GTU/Playwright'
import { ExpressionKinds, ExpressionTypes } from '@gobletqa/shared/constants'

const defaultTimeout = 5000
const states = [`attached`, `detached`, `visible`, `hidden`]

enum EState {
  attached=`attached`,
  detached=`detached`,
  visible=`visible`,
  hidden=`hidden`
}


/**
 * Waits for the element at `selector` to be in state `state`
 * @param {string} selector - valid playwright selector
 * @param {string} state - one of four valid states noted above
 */
export const waitForSelectorState = async (
  selector:string,
  state:EState,
  timeout:number=defaultTimeout,
  ctx:TStepCtx
) => {
  if (!states.includes(state))
    throw new Error('Invalid Selector State: ' + state)

  const element = await getLocator(selector, ctx)
  return await element.waitFor({
    timeout,
    state: `${state}`.trim() as EState,
  })
}

const meta = {
  name: `Wait for element state`,
  module: `waitForSelectorState`,
  description: `Locates an element by selector and verifies its state.
  https://playwright.dev/docs/api/class-page/#pagewaitforselectorselector-options`,
  examples: [
    `I wait for element ".tab-bar-title:text('Tab-1')" to be "visible"`,
  ],
  expressions: [
    {
      type: `string`,
      description: `The selector for a single element.`,
      example: `.tab-bar-title:text('Tab-1')`,
    }
  ],
}

const timeoutExpression = {
  decor: false,
  label: `Timeout`,
  example: `5000`,
  kind: ExpressionKinds.number,
  type: ExpressionTypes.integer,
  description: `The amount of time to wait for the element to be in the desired state. In milliseconds`,
}

const stateExpression = {
  decor: false,
  label: `State`,
  options: states,
  example: `visible`,
  type: ExpressionTypes.string,
  kind: ExpressionKinds.options,
  description: `The state of the element to wait for. Must be one of ${states.join(', ')}.`,
}

const multiMeta = {
  ...meta,
  expressions: meta.expressions.concat([stateExpression])
}


When(`I wait for {string}`, (selector:string,ctx:TStepCtx) => waitForSelectorState(
  selector,
  EState.attached,
  defaultTimeout,
  ctx
), meta)

When(`I wait for {string} to hide`, (selector:string,ctx:TStepCtx) => waitForSelectorState(
  selector,
  EState.hidden,
  defaultTimeout,
  ctx
), meta)

When(`I wait for {string} to show`, (selector:string,ctx:TStepCtx) => waitForSelectorState(
  selector,
  EState.visible,
  defaultTimeout,
  ctx
), meta)

When(`I wait for {string} to detach`, (selector:string,ctx:TStepCtx) => waitForSelectorState(
  selector,
  EState.detached,
  defaultTimeout,
  ctx
), meta)

When(`I wait for {string} to attach`, (selector:string,ctx:TStepCtx) => waitForSelectorState(
  selector,
  EState.attached,
  defaultTimeout,
  ctx
), meta)

When(`I wait for {string} to be {string}`, waitForSelectorState, multiMeta)
When(`I wait for element {string} to be {string}`, (
  selector:string,
  state:EState,
  ctx:TStepCtx
) => waitForSelectorState(
  selector,
  state,
  defaultTimeout,
  ctx
), { race: true, ...multiMeta })

When(`I wait {int} for element {string} to be {string}`, (
  timeout:number,
  selector:string,
  state:EState,
  ctx:TStepCtx
) => waitForSelectorState(
  selector,
  state,
  timeout,
  ctx
), {
  race: true,
  ...multiMeta,
  name: `Wait {timeout} for element state`,
  expressions: [timeoutExpression, ...multiMeta.expressions] 
})

