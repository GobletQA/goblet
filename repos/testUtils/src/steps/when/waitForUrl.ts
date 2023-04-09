import type { TWorldConfig } from '@ltipton/parkin'

import { When } from '@GTU/Parkin'
import { getPage } from '@GTU/Playwright'

/**
 * Returns when the required load state has been reached.
 * Without specifying any arguments, it by default waits for the load event to fire.
 * Read more here: https://playwright.dev/docs/api/class-page#pagewaitforloadstatestate-options
 */
export const waitForUrl = async (url:string, world:TWorldConfig) => {
  const page = await getPage()
  await page.waitForURL(url)
}

const meta = {
  module: `waitForUrl`,
  description: `Waits for the browser url to match the passed in expression.\nNote that if the expression does not contain wildcard characters (i.e. *); the page will wait for a URL that is exactly equal to the expression.`,
  examples: [
    `And I wait for the url https://www.gobletqa.com`,
    `And I wait for the url to match **/gobletqa.com/**`,
  ]
}

When(`I wait for the url {word}`, waitForUrl, meta)
When(`I wait for the url to match {word}`, waitForUrl, meta)
