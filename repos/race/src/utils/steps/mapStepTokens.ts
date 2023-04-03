import type {
  TExpPart,
  TMatchTokens,
} from '@GBR/types'

import { removeQuotes } from '@GBR/utils/helpers/removeQuotes'


export const mapStepTokens = (
  expressions:TExpPart[],
  tokens:TMatchTokens[]
) => {
  return expressions.map(exp => {
    const token = tokens.find(tok => tok.defIndex === exp.index)
    if(!token) return exp
  
    /**
     * The token.index is the updated index of an expression
     * Which is not the same when a expression has been replaced with a value
     * Meaning any changes in the step which effect the length are accounted for
     * i.e. I "click" {word} **vs** I {string} {word}
     *                10                       11
     * {word} starts at 10      {word} starts at 11
     *
     * The {string} expression was replaced with "click", which changed the string length
     *
     * When editing the step.step, we want to start editing at index 10, not 11
     * Because that is the correct index of the value, which is not the same as the original index
     *
     * We merge the exp and token together, and over right the exp.index with the token.index
     * This allows using it as a reference when editing the step.step so we edit the correct location
     */
    const value = token ? removeQuotes(token.match) : exp.text
    return value !== exp.text
      ? {...exp, ...token, value} as TExpPart
      : {...exp, ...token, value: ''} as TExpPart
  })
}