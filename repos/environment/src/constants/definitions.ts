import { deepFreeze } from '../utils/helpers'

// Default Folder name of the folder where step-definition overrides are placed
// Used when a mounted repo overrides a default step-definition
// All overrides should be saved in this folder
export const DefinitionOverrideFolder = `overrides`

export const ExpressionNoQuoteTypes = deepFreeze<Record<string, string>>({
  int: `int`,
  num: `num`,
  float: `float`,
  number: `number`,
  integer: `integer`,
})

export const ExpressionTypes = deepFreeze<Record<string, string>>({
  ...ExpressionNoQuoteTypes,
  ...({
    any: `any`,
    word: `word`,
    array: `array`,
    object: `object`,
    string: `string`,
    boolean: `boolean`,
  })
})

export const ExpressionKinds = deepFreeze<Record<string, string>>({
  url: `url`,
  text: `text`,
  pairs: `pairs`,
  group: `group`,
  alias: `alias`,
  number: `number`,
  boolean: `boolean`,
  selector: `selector`,
  element: `element`,
  select: `select`,
  media: `media`, // - video || audio element
  className: `className`, // - element style rule
  style: `style`, // - element style rule
  attribute: `attribute`, // - Any element attribute
  checkbox: `checkbox`, // - checked || unchecked/
  options: `options`, // - Dropdown select from options
})