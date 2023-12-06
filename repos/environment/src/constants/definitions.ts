import {deepFreeze} from '@keg-hub/jsutils/deepFreeze'

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
  upload: `upload`, // - files that can be uploaded from the uploads directory
  download: `download`, // - files that have been downloaded to the downloads directory
  media: `media`, // - video || audio element
  className: `className`, // - element style rule
  style: `style`, // - element style rule
  checkbox: `checkbox`, // - checked || unchecked/
  options: `options`, // - Dropdown select from options
  attribute: `attribute`, // - Any element attribute
  code: `code`, // - Javascript code via doc script
  world: `world`,  // - Value from the world object
  iframe: `iframe`  // - Iframe elements on the page
})

export const ExpressionElements = deepFreeze<Record<string, string[]>>({
  link: [`a`, `[role="link"]`],
  label: [`label`, `[role="label"]`],
  button: [`button`, `[role="button"]`],
  select: [`select`, `[role="select"]`],
  checkbox: [
    `input[type="checkbox"]`,
    `[role="checkbox"]`
  ],
  input: [
    `input`,
    `input[type="text"]`,
    `[role="input"]`
  ],
  inputCheck: [
    `input[type="radio"]`,
    `input[type="checkbox"]`,
    `[role="radio"]`,
    `[role="checkbox"]`,
  ],
  iframe: [`iframe`]
})


export const ExpressionCustomInputs = deepFreeze<Record<string, string>>({
  world: `world`,
  editor: `editor`,
  textbox: `textarea`,
  textarea: `textarea`,
})