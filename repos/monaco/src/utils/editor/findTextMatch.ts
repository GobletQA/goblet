import type { editor } from 'monaco-editor'
import type { TDecorationMeta } from '@GBM/types'


type TFindTextMatch = {
  model:editor.ITextModel
  search:string
  meta:TDecorationMeta
  compare:(match:editor.FindMatch) => false|undefined|null|editor.FindMatch
}

/**
 * Uses the passed in model to fine matching text
 * Then loops over all matches and calls the passed in compare function
 * Compare function should return the match if it's a match otherwise false
 */
export const findTextMatch = ({
  meta,
  model,
  search,
  compare
}:TFindTextMatch) => {

  const matches = model.findMatches(search, true, false, false, null, false)
  // If no matches found, log and return false 
  if(!matches.length){
    console.warn(`Could not find match to search text`, search, model, matches, meta)
    return false
  }

  // If only one match, return it
  if(matches.length === 1) return matches[0]

  // Loop the matches, and call the compare function until a match if found
  return matches.reduce((found:false|editor.FindMatch, match:editor.FindMatch) => {
    return found || compare(match) || found
  }, false)

}
