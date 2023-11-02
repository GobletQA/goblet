import type { TStepCtx } from '@GTU/Types'

import { When } from '@GTU/Parkin'
import { getPage } from '@GTU/Playwright'
import { ExpressionCustomInputs, ExpressionKinds, ExpressionTypes } from '@GTU/Constants'

/**
 * Click the element matching `selector`
 */
export const execCodeInBrowser = async (ctx:TStepCtx) => {
  const code = ctx?.doc?.content ?? ``
  const page = await getPage()

  /**
  * Passed the code to the page context, then executes it with eval
  */
  await page.evaluate((code) => code && eval(code), code)
}

const meta = {
  module: `execCodeInBrowser`,
  name: `Execute javascript`,
  alias: [`exec`, `code`, `javascript`],
  examples: [
    `When I execute the following code in the browser`,
  ],
  description: `Executes the passed in javascript code in the browser context.`,
  expressions: [
    {
      kind: ExpressionKinds.code,
      type: ExpressionTypes.string,
      kindRef: ExpressionCustomInputs.editor,
      description: `The code to be executed with the context of the browser.`,
      example: `const element = document.querySelector('.my-element').textContent = "Example text content."`,
    },
  ],
  race: true
}

When(`I execute the following code in the browser`, execCodeInBrowser, meta)
