import type { TStepCtx } from '@GTU/Types'

import { Then } from '@GTU/Parkin'
import { getPage } from '@GTU/Playwright'
import { ExpressionKinds, ExpressionTypes } from '@gobletqa/environment/constants'

const clickIfExists = async (selector:string, ctx:TStepCtx) => {
  const page = await getPage()

  await page.locator(selector)
    .click({
      delay: 0,
      force: true,
      timeout: 1000,
      noWaitAfter: true,
    })
    .catch((err:Error) => {
      if(err.message.includes(`locator.click:`)) return true
      
      throw err
    })

  return true
}

Then(`I click {string} if it exists`, clickIfExists, {
  race: true,
  name: `Click if exists`,
  module: `clickIfExists`,
  alias: [`Click if exists`, `click`, `exists`],
  description: `Clicks an element if it exists on the page`,
  examples: [
    `Then I click "#modal-pop-up" if it exists`,
  ],
  expressions: [
    {
      kind: ExpressionKinds.text,
      type: ExpressionTypes.string,
      example: `#modal-pop-up`,
      description: `Selector for an element that may, or may not be on the page`,
    }
  ]
})
