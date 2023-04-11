import { getPage } from '@GTU/Playwright/browserContext'

type TEvalMethod = <T=any>(...args:any[]) => T

/**
 * Evaluates all the element that match selector
 * @param {string} selector
 * @param {Function} fn - evaluation function
 */
export const evalAll = async (
  selector:string,
  fn:TEvalMethod
) => {
  const page = await getPage()
  const data = page.$$eval(selector, fn)

  if (!data)
    throw new Error(`Evaluation returned null for selector "${selector}"`)

  return data
}

