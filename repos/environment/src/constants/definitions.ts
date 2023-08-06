import { keyMap, deepFreeze } from '@keg-hub/jsutils'

// Default Folder name of the folder where step-definition overrides are placed
// Used when a mounted repo overrides a default step-definition
// All overrides should be saved in this folder
export const DefinitionOverrideFolder = `overrides`


export const ExpressionNoQuoteTypes = deepFreeze<Record<string, string>>(
  keyMap([
  `int`,
  `num`,
  `float`,
  `number`,
  `integer`,
  ])
)

export const ExpressionTypes = deepFreeze<Record<string, string>>({
  ...ExpressionNoQuoteTypes,
  ...keyMap([
    `any`,
    `word`,
    `array`,
    `object`,
    `string`,
    `boolean`
  ])
})

export const ExpressionKinds = deepFreeze<Record<string, string>>(
  keyMap([
    `url`,
    `text`,
    `pairs`,
    `group`,
    `alias`,
    `number`,
    `boolean`,
    `selector`,
    `element`,
    `select`,
    `media`, // - video || audio element
    `className`, // - element style rule
    `style`, // - element style rule
    `attribute`, // - Any element attribute
    `checkbox`, // - checked || unchecked/
    `options`, // - Dropdown select from options
  ])
)
