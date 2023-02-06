import type { TBrowserPage} from '@GSC/types'

export const addAutomateInitScripts = async (page:TBrowserPage) => {
  // @ts-ignore
  if(!page.__GobletAutomateInstance) return

  // @ts-ignore
  const automate = page.__GobletAutomateInstance
  await automate?.addInitScripts?.()
}

export const turnOnElementSelect = async (page:TBrowserPage) => {
  // @ts-ignore
  if(!page.__GobletAutomateInstance)
    throw new Error(`Could not find goblet automate instance on page object`)

  // @ts-ignore
  const automate = page.__GobletAutomateInstance
  await automate?.selectPageElementOn?.()
}

export const turnOffElementSelect = async (page:TBrowserPage) => {
  // @ts-ignore
  if(!page.__GobletAutomateInstance)
    throw new Error(`Could not find goblet automate instance on page object`)

  // @ts-ignore
  const automate = page.__GobletAutomateInstance
  await automate?.selectPageElementOff?.()
}