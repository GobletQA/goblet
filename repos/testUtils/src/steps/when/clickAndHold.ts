import type { TStepCtx } from '@GTU/Types'

import { Then } from '@GTU/Parkin'
import { clickElement } from '@GTU/Support/helpers'
import { ExpressionKinds, ExpressionTypes } from '@gobletqa/environment/constants'

export const clickAndHold = async (
  selector:string,
  seconds:number,
  ctx:TStepCtx
) => await clickElement({ selector, delay: seconds * 1000 }, ctx)

const meta = {
  race: true,
  module: `clickAndHold`,
  alias: [`click`, `hold`],
  name: `Click and hold`,
  description: `Clicks on an element and holds for the specified number of seconds`,
  examples: [
    `Then I click "#button" and hold for 7 seconds`
  ],
  expressions: [
    {
      type: ExpressionTypes.string,
      kind: ExpressionKinds.element,
      description: `Selector of the element to click`,
      examples: [`#button`],
    },
    {
      type: ExpressionTypes.number,
      kind: ExpressionKinds.number,
      description: `Delay in seconds`,
      examples: [`7`]
    }
  ],
}

Then(`I click {string} and hold for {int} seconds`, clickAndHold, meta)