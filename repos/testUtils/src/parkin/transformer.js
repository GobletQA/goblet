const babelJest = require('babel-jest')
const {getCacheKey} = babelJest.createTransformer()

/**
 * Custom jest transformer for parsing feature files
 * Uses a consistent Parkin instance setup in the testUtils/src/parkin/parkinTestInit.js
 *
 * @return {Object} - Jest custom transformer model object
 */
module.exports = {
  getCacheKey(fileData, filename, ...rest) {
    const babelCacheKey = getCacheKey(fileData, filename, ...rest)

    return createHash('md5')
      .update(babelCacheKey)
      .update('goblet')
      .digest('hex')
  },
  process(src) {
    return {
      code: [
        `const PK = global.getParkinInstance()`,
        `const parsedFeature = PK.parse.feature(${JSON.stringify(src)})`,
        `return PK.run(parsedFeature, global.getParkinOptions())`,
      ].join(`\n`)
    }
  },
}
