import type {
  TBrowser,
  TBrowserPage,
  EBrowserName,
  TPWComponents,
} from '@GSC/types'

import playwright from 'playwright'

/**
  This method gets the context from the playwright module directly
  Which then allows getting the browser and pages
  This uses internal references to properties that are not intended to be exposed
  So it may cause issues to depend on it exclusively
  
  It has the added benefit of not needing to manage cache playwright components internally
 */

export const checkInternalPWContext = (type:EBrowserName):TPWComponents|undefined => {
  // @ts-ignore
  const contexts = playwright[type]?._contexts
  if(!contexts?.size) return undefined

  const context = [...contexts][0]
  if(!context?._pages?.size) return undefined

  const browser:TBrowser = context?.browser?.()
  const page:TBrowserPage = [...context?._pages][0]
  if(!page || !browser) return undefined

  return {
    page,
    browser,
    context,
  } as TPWComponents
}