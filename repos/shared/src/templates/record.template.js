import { getPage } from '@GTU/Playwright'

;(async() => {
  const page = await getPage()
  await page.goto('{{appUrl}}')

  // -- 🍷 GOBLET


})()