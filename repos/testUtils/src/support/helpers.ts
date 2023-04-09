import type { TWorldConfig } from '@ltipton/parkin'
import type { TBrowserPage } from '@GTU/Types'

import { get } from '@keg-hub/jsutils'
import { Logger } from '@keg-hub/cli-utils'
import { getPage, getLocator } from '@GTU/Playwright'

type TLocator = Record<string, any>

type TClickEl = {
  selector:string
  locator:TLocator
  page:TBrowserPage
}

type TFillInput = TClickEl & {
  text:string
}

const checkTypes = {
  less: {
    match: [`less`, `<`],
    method: (val, count) => {
      Logger.stdout(`Expect ${val} to be less-then ${count}`)
      expect(val).toBeLessThan(count)
    }
  },
  greater: {
    match: [`greater`, `>`],
    method: (val, count) => {
      Logger.stdout(`Expect ${val} to be greater-then ${count}`)
      expect(val).toBeGreaterThan(count)
    }
  },
  equal: {
    match: [ `equal`, `=`, `==`, `===`],
    method: (val, count) => {
      Logger.stdout(`Expect ${val} to be equal to ${count}`)
      expect(val).toEqual(count)
    }
  },
  lessEqual: {
    match: [`less-equal`, `<=`],
    method: (val, count) => {
      Logger.stdout(`Expect ${val} to be less-then or equal to ${count}`)
      expect(val).toBeLessThanOrEqual(count)
    }
  },
  greaterEqual: {
    match: [`greater-equal`, `>=`],
    method: (val, count) => {
      Logger.stdout(`Expect ${val} to be greater-then or equal to ${count}`)
      expect(val).toBeGreaterThanOrEqual(count)
    }
  }
}

const compareTypes = [
  `contains`,
  `matches`
] 

/**
 * Expects the number of dom elements matching `selector` to match `count` based on the comparison screen
 * @param {number} count1 - original count amount
 * @param {number} count2 - next count amount
 * @param {string} type - The type being counted
 */
export const greaterLessEqual = (
  count1:number,
  count2:number,
  type:string
) => {
  const foundType = Object.entries(checkTypes)
    .find(([key, def]) => def.match.includes(type))
  
  if(!foundType)
    throw new Error(`Invalid type. Must be one of ${greaterLessEqual.matchTypes}`)

  foundType[1].method(count1, count2)
}
/**
 * Builds the match types from the checkTypes and adds to the greaterLessEqual method
 * Allows them to be accessible when using this method
 */
greaterLessEqual.matchTypes = Object.entries(checkTypes)
  .reduce((types, [key, def]) => {
    types.push(...def.match)
    return types
  }, [])
  .join(', ')


/**
 * Cleans the passed in world path to ensure world || $world is not the start of the string
 * @param {string} worldPath - Path on the world object
 *
 */
export const cleanWorldPath = (worldPath:string) => {

  const pathArr = worldPath.trim().split(`.`).filter(part => Boolean(part.trim()))
  const noWorld = pathArr[0] === '$world' || pathArr[0] === 'world' ? pathArr.slice(1) : pathArr

  return noWorld.filter(Boolean).join('.').trim()
}


/**
 * Gets the data from the passed in world path and world object 
 * @param {string} worldPath - Path on the world object
 * @param {object} world - Global world object
 * @param {*} [fallback] - Value to use if world value does not exit
 *
 */
export const getWorldData = (
  worldPath:string,
  world:TWorldConfig,
  fallback?:any
) => {
  const cleaned = cleanWorldPath(worldPath)
  if(!cleaned) throw new Error(`World Path "$world.${worldPath}" is invalid.`)

  const saved = get(world, cleaned, fallback)
  if(saved === undefined) throw new Error(`Saved value "$world.${worldPath}" does not exist.`)

  return saved
}

/**
 * Compares the content of two values, either contains or exact matching 
 * @param {*} val1 - First value to compare
 * @param {*} val2 - Value to compare against
 * @param {string} type - Type of comparison to do
 *
 */
export const compareValues = (
  val1:any,
  val2:any,
  type:string
) => {
  if(!compareTypes.includes(type))
    throw new Error(`Compare type "${type}" is invalid. Must be one of "${compareTypes.join(', ')}".`)

  type === `contains`
    ? expect(val1).toEqual(expect.stringContaining(val2))
    : expect(val1).toEqual(val2)
}

/**
 * Calls a method on a found locator
 * @param {string} selector - CSS selector of Dom Element
 * @param {string} prop - Method name to call
 * @param {Object} locator - Playwright location object 
 *
 */
export const callLocatorMethod = async (
  selector:string,
  prop:string,
  locator?:TLocator
) => {
  const element = locator || await getLocator(selector)
  if(!element[prop])
    throw new Error(`Selected Element ${selector} missing prop method "${prop}".`)

  return await element[prop]()
}

export const getLocatorAttribute = async (
  selector:string,
  attr:string,
  locator?:Record<string, any>
) => {
  const element = locator || await getLocator(selector)
  return await element.getAttribute(attr)
}

export const getLocatorProps = async (
  selector:string,
  locator?:TLocator
) => {
  const element = locator || await getLocator(selector)

  // TODO: Add more properties to the returned object
  return await element.evaluate(el => ({
    value: el.value,
    tagName: el.tagName,
    className: el.className,
    textContent: el.textContent,
  }))
}

export const getLocatorTagName = async (
  selector:string,
  locator?:TLocator
) => {
  const element = locator || await getLocator(selector)
  return await element.evaluate((el:HTMLElement) => el.tagName)
}

export const getLocatorContent = async (
  selector:string,
  locator?:TLocator
) => {
  const element = locator || await getLocator(selector)
  const tagName = await getLocatorTagName(selector, element)

  return tagName === 'INPUT' || tagName === 'TEXTAREA' || tagName === 'SELECT'
    ? await element.inputValue()
    : await element.textContent()
}

/**
 * Finds an element from selector or locator, and clicks it
 * @param {TClickEl} params
 *
 */
export const clickElement = async ({
  page,
  selector,
  locator
}:TClickEl) => {
  page = page || getPage()
  !locator && await getLocator(selector)
  await page.click(selector, {
    force: true
  }) 
}

/**
 * Finds an input from selector or locator, then fills it with text
 * @param {Object} params
 *
 */
export const fillInput = async ({
  page,
  text,
  locator,
  selector,
}:TFillInput) => {
  page = page || getPage()
  await clickElement({ page, selector, locator })
  //clear value before setting otherwise data is appended to end of existing value
  await page.fill(selector, '')
  await page.type(selector, text)
}
