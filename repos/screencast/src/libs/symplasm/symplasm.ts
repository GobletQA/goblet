
import type { TSymAST, TSymParseOpts } from '@GSC/types'

import { isStr } from '@keg-hub/jsutils/isStr'
import { emptyObj } from '@keg-hub/jsutils/emptyObj'
import { emptyArr } from '@keg-hub/jsutils/emptyArr'

//** TODO: fix the symplasm export */
const symplasm = require('@ltipton/symplasm')

/**
 * Default blocks ignored by symplasm
 */
const ignoreBlocks = [
  ``,
  `g`,
  `svg`,
  `path`,
  `style`,
  `script`,
]

const allElements = (block:TSymAST) => {
  const tagName = block?.[0] || ``

  return tagName.includes(`-`) || ignoreBlocks.includes(tagName)
    ? { 0: ``, 1: {}, 2: [] }
    : block
}

export const symParse = (content:string, opts?:TSymParseOpts):TSymAST[] => {

  const htmlAst = (symplasm.parse(content, {
    ...opts,
    allElements,
    comments: false,
  }) || emptyObj)

  return htmlAst?.[`2`]?.filter((item:string|Record<any, any>) => {
    return isStr(item) && !item.trim()
      ? false
      : !item?.[`0`] && !item?.[`2`]?.length
        ? false
        : true
  }) || emptyArr
}