import type { TScrapeBrowser } from '@GBB/types'

import { GBrowser } from '@GBB/browser'

export const scrapePage = async (data:TScrapeBrowser) => {
  const {
    url,
    repo,
    browserConf,
    pwComponents,
  } = data

  const { page } = pwComponents
    || await GBrowser.start({ browserConf, config: repo })

  url && await page.goto(url)
  await page.waitForLoadState()

  return await page.content()
}
