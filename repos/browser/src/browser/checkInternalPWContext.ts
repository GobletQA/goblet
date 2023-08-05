import type {
  TBrowser,
  TBrowserPage,
  EBrowserName,
  TPWComponents,
} from '@GBR/types'

import playwright from 'playwright'
import { EmptyBrowser } from './emptyBrowser'
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
  let browser:TBrowser = context?.browser?.()
  if(context && browser === null) browser = new EmptyBrowser(context, type)

  const components = { browser, context } as TPWComponents

  if(!context?._pages?.size) return components

  const page:TBrowserPage = [...context?._pages][0]
  page && (components.page = page)

  return components
}