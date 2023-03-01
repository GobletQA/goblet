const { When } = require('@GTU/Parkin')
const { clickElementHandler } = require('./clickElement')
const { ExpressionKinds, ExpressionTypes } = require('@gobletqa/shared/constants')

const attrTypes = [`.`, `#`, `$`, `#`, `:`, `(`, `>`]

const checkSelectorType = (selector) => {
  const check = selector.trim()
  return attrTypes.find(attr => check.startsWith(attr))
    ? selector
    : ` :text("${check}")`
}

const clickElementTypeHandler = async (type, selector, world) => {
  const formatted = checkSelectorType(selector)
  const joined = `${type}${formatted}`

  return await clickElementHandler(joined, world)
}

const meta = {
  module: `clickElements`,
  description: `Locates an element by selector and clicks it. If the passed in expression does not start with a special character it is treated as text, and will use the :text() selector when locating the element`,
  expressions: [
    {
      type: ExpressionTypes.string,
      kind: ExpressionKinds.selector,
      description: `The selector of an element that exists on the page`,
      example: `"> [name='my-element']", ".my-button", or "My link text"`,
    },
  ],
}

When('I click the link {string}', (...args) => clickElementTypeHandler(`a`, ...args), {
  ...meta,
  module: `clickElements - Link`,
  examples: [`When I click the link "my-link"`],
  
})

When('I click the button {string}', (...args) => clickElementTypeHandler(`button`, ...args), {
  ...meta,
  module: `clickElements - Button`,
  examples: [`When I click the button "Submit"`],
})

module.exports = {
  clickElementHandler,
}
