const { When } = require('@GTU/Parkin')
const { getPage } = require('@GTU/Playwright')

const mouseLeavePage = async (data, world) => {
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

module.exports = {
  mouseLeavePage,
}
