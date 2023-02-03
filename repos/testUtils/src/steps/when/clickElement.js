const { When } = require('@GTU/Parkin')
const { getPage, getLocator } = require('@GTU/Playwright')

/**
 * Click the element matching `selector`
 * @param {String} selector - valid playwright selector
 */
const clickElementHandler = async selector => {
  const page = await getPage()
  // Actionability checks (Auto-Waiting) seem to fail in headless mode
  // So we use locator.waitFor to ensure the element exist on the dom
  // Then pass {force: true} options to page.click because we know it exists
  await getLocator(selector)
  return page.click(selector, {
    force: true
  })

}


const meta = {
  module: `clickElement`,
  examples: [
    `When I click "button[name='unique_name']"`,
    `When I click the element "button[name='unique_name']"`,
  ],
  description: `Locates an element by selector and clicks it.`,
  expressions: [
    {
      type: 'string',
      description: `The element selector. Selector must be specific enough to locate a single element.`,
      example: "button[name='btn-name']",
    },
  ],
}

When('I click {string}', clickElementHandler, {
  ...meta,
  race: {
    name: `Click`,
    alias: [`Touch`, `Press`],
    description: `Action to simulate clicking, touching, or pressing an element on the page`
  }
})
When('I click the {string}', clickElementHandler, meta)
When('I click the element {string}', clickElementHandler, meta)
When('I click the page', async () => await clickElementHandler(`body`), {
  ...meta,
  expressions: [],
  examples: [`When I click the page`],
})

module.exports = {
  clickElementHandler,
}
