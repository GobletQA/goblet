import { default as createCacheKey} from '@jest/create-cache-key-function'


/**
 * Custom jest transformer for parsing feature files
 * Uses a consistent Parkin instance setup in the testUtils/src/parkin/parkinTestInit.js
 *
 * @return {Object} - Jest custom transformer model object
 */
const transformer = {
  getCacheKey: createCacheKey([], []),
  process(src:string) {
    return {
      code: [
        `const PK = global.getParkinInstance()`,
        `const parsedFeature = PK.parse.feature(${JSON.stringify(src)})`,
        `return PK.run(parsedFeature, global.getParkinOptions())`,
      ].join(`\n`)
    }
  },
}

export {
  transformer as default
}