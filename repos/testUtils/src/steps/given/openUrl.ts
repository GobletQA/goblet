import type { TWorldConfig } from '@ltipton/parkin'

import { Given } from '@GTU/Parkin'
import { getPage } from '@GTU/Playwright'
import { get, isStr } from '@keg-hub/jsutils'
import { ExpressionKinds, ExpressionTypes } from '@gobletqa/shared/constants'

/**
 * Parses the url, replacing any dynamic variables
 * @param {string} url
 * @param {Object} world
 * @return {string} - updated url
 */

const parseUrl = (url:string, world:TWorldConfig) => {
  if (!url.startsWith(`$world`)) return url

  //isolate query string
  const [baseUrl, urlParams] = url.split('?')
  //console.log('baseUrl : ' + baseUrl + ' , urlParams : ' + urlParams)

  //isolate path
  const urlPath = baseUrl.includes('/')
    ? baseUrl.substring(baseUrl.indexOf('/'), baseUrl.length)
    : ''
  //console.log('urlPath : ' + urlPath)

  //isolate domain
  const urlDomain = baseUrl.includes('/')
    ? baseUrl.substring(0, baseUrl.indexOf('/'))
    : baseUrl
  //console.log('urlDomain : ' + urlDomain)

  const [_, ...worldPath] = urlDomain.split('.')
  //console.log('worldPath : ' + worldPath)

  const parsed = get(world, worldPath)
  //console.log('parsed : ' + parsed)

  const domainAndPath = urlPath ? parsed.concat(urlPath) : parsed
  const urlConstruct = urlParams
    ? domainAndPath + '?' + urlParams
    : domainAndPath

  if (!parsed) throw new Error(`No url found at world path ${url}.`)

  return urlConstruct
}

/**
 * Opens the url in a playwright browser
 * @param {string} url - url to load in the browser
 * @param {object} world
 */
export const openUrl = async (url:string, world:TWorldConfig) => {
  const site = parseUrl(url, world)
  if (!isStr(site)) throw new Error(`Site must be a valid URL. Found: ${site}`)

  const page = await getPage()
  await page.goto(site)
}

Given('I navigate to {string}', openUrl, {
  module: `openUrl`,
  alias: [`Open Url`],
  name: `Navigate to Url`,
  description: `Navigates to the given website within the browser.\nRequires an absolute URL but the URL can be dynamicly constructed. See examples below for usage.\nPages that return a status code, even a 404, will pass.  Pages that don\'t return a status code will fail.`,
  expressions: [
    {
      kind: ExpressionKinds.url,
      type: ExpressionTypes.string,
      example: `http://www.gobletqa.com`,
      description: `URL/URI of the website the browser should navigate to.`,
    },
  ],
  examples: [
    `Given I navigate to "https://www.gobletqa.com"`,
    `Given I navigate to "$world.myURL/nav/assets/images"`,
    `Given I navigate to "$$myURL?testUrlParam=1"`,
    `Given I navigate to "$world.myURL/search?q=cms"`
  ],
  race: true
})
