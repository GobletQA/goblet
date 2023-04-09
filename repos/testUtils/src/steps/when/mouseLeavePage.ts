import type { TWorldConfig } from '@ltipton/parkin'

import { When } from '@GTU/Parkin'
import { getPage } from '@GTU/Playwright'

export const mouseLeavePage = async (world:TWorldConfig) => {
  const page = await getPage()
  await page.locator('html').dispatchEvent('mouseleave')
}

const meta = {
  module: `mouseLeavePage`,
  examples: [
    'I move the mouse off the page'
  ],
  description: `Simulates moving the mouse off the browser page.`,
  expressions: [
  ],
}

When('I move the mouse off the page', mouseLeavePage, meta)

