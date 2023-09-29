import type { editor } from 'monaco-editor'
import type { TDecoration, TDecorationList, TDecorationMeta } from '@GBM/types'


type TFindTextMatch = {
  search:string
  meta:TDecorationMeta
  decoration:TDecoration
  model:editor.ITextModel
  decorationList:TDecorationList,
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
  compare,
  decoration,
  decorationList
}:TFindTextMatch) => {

  // We store the decorationId on the marginClassName field so we can find it later
  // It's not used for styles, but technically it could be
  // The start action sets it
  // And future actions can use it to look up existing matching decorations
  // This allows not having to search for matching text, and is prone to duplicates and bugs
  if(meta.action !== `start`){
    const decorationId = decoration.options.marginClassName
    const existing = Object.values(decorationList).find(({ options }) => options.marginClassName === decorationId)

    if(existing?.range) return { range: existing.range, matches: null } as editor.FindMatch
  }

  const matches = model.findMatches(search, true, false, false, null, false)
  // If no matches found, log and return false 
  if(!matches.length){
    console.warn(`Could not find match to search text`, search, model, matches, meta)
    return false
  }

  // If only one match, return it
  if(matches.length === 1) return matches[0]

  // Loop the matches, and call the compare function until a match is found
  return matches.reduce((found:false|editor.FindMatch, match:editor.FindMatch) => {
    return found || compare(match) || found
  }, false)

}
