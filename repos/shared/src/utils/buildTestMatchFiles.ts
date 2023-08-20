import { isStr } from '@keg-hub/jsutils/isStr'
import { noPropArr } from '@keg-hub/jsutils/noPropArr'

export type TTestMatch = {
  ext?:string
  type?:string
  testDir?:string
  shortcut?:string
  extOnly?:boolean
}

/**
 * Helper to build the path to a test match file type
 * @function
 * @private
 * @param {string} prefix - Base path of the test match path
 * @param {string} tag - Identifier for matching test files
 * @param {string} ext - Custom file extension
 *
 * @returns {Array<string>} - Built test match file paths
 */
const buildFilePaths = (prefix:string, tag?:string) => {
  return tag && isStr(tag)
    ? [
        `${prefix}/*.${tag}.js`,
        `${prefix}/${tag}.*.js`
      ]
    : noPropArr
}

/**
 * If a custom ext is passed, then search for files with the custom ext
 * @function
 * @private
 * @param {string} prefix - Base path of the test match path
 * @param {string} ext - Custom file extension
 *
 * @returns {Array<string>} - Built test match file paths
*/
const buildCustomExt = (prefix, ext) => {
  return ext ? [`${prefix}/*.${ext}`] : noPropArr
}

/**
 * Builds the paths to where test files can be found and their name
 * See here for info https://jestjs.io/docs/next/configuration#testmatch-arraystring
 * @function
 * @public
 */
export const buildTestMatchFiles = ({
  testDir,
  type,
  shortcut,
  ext,
  extOnly
}:TTestMatch) => {
  if(!isStr(type) || !isStr(ext)) return noPropArr

  const prefix = testDir ? `${testDir}/**` : `**`
  if(extOnly) return [...buildCustomExt(prefix, ext)] 

  return [
    ...(ext && buildCustomExt(prefix, ext) || []),
    ...(type && buildFilePaths(prefix, type) || []),
    ...buildFilePaths(prefix, shortcut),
    ...buildFilePaths(prefix, `test`),
    ...buildFilePaths(prefix, `spec`),
  ].filter(Boolean)
}
