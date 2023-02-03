const { When } = require('@GTU/Parkin')
const { getLocator } = require('@GTU/Playwright')
const { getWorldData } = require('@GTU/Support/helpers')
const { SavedLocatorWorldPath } = require('@GTU/Constants')


const typeText = async (element, data) => {
  //clear value before setting otherwise data is appended to end of existing value
  await element.fill('')
  await element.type(data)
}

const typeWithSaved = async (data, world) => {
  const { element } = getWorldData(SavedLocatorWorldPath, world)
  const el = element || await getLocator(`:focus`)

  await typeText(el, data)
}

/**
 * Sets the input text of selector to data
 */
const typeWithSelector = async (data, selector=`:focus`) => {
  const element = await getLocator(selector)
  await typeText(element, data)
}

const meta = {
  module: `typeText`,
  examples: [
    `When I write "some text"`,
    `When I type "my.name@company.com" into the element "input[name=email]"`
  ],
  description: `Locates input element by selector and replaces existing value, if any, to the desired text.`,
  expressions: [
    {
      type: 'string',
      description: `Desired text to be typed into the input.`,
      example: 'This is some text.',
    },
    {
      type: 'string',
      description: `The selector for a single element that allows input. One of Input, Textarea, or [content-editable]`,
      example: '#search-input',
    },
  ],
}

When('I write {string}', typeWithSaved, meta)
When('I type {string}', typeWithSaved, meta)
When('I type {string} into {string}', typeWithSelector, {
  ...meta,
  race: {
    name: `Type text`,
    alias: [`Write text`, `Input text`],
    description: `Action to simulate typing text into an element on the page`
  }
})
When('I type {string} into the element {string}', typeWithSelector, meta)

module.exports = {
  typeWithSaved,
  typeWithSelector
}
