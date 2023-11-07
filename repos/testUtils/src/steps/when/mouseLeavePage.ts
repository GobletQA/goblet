import type { TStepCtx } from '@GTU/Types'

import { When } from '@GTU/Parkin'
import { getPage } from '@GTU/Playwright'

export const mouseLeavePage = async (ctx:TStepCtx) => {
  const page = await getPage()
  await page.locator('html').dispatchEvent('mouseleave')
}

const meta = {
  name: `Leave page`,
  module: `mouseLeavePage`,
  examples: [
    `I move the mouse off the page`
  ],
  description: `Simulates moving the mouse off the browser page.`,
  expressions: [
  ],
}

When(`I move the mouse off the page`, mouseLeavePage, meta)

