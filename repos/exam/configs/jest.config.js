const path = require('path')
const rootDir = path.join(__dirname, `..`)

const baseConfig = require('../../../configs/jest.base.config.js')

module.exports = {
  ...baseConfig,
  /* ---- Service specific options here ---- */
  rootDir,
  verbose: true,
  setupFilesAfterEnv: [`${rootDir}/scripts/jest.setup.ts`],
  collectCoverageFrom: ['**/*.ts', '!**/*.types.ts', '!**/*.d.ts'],
  transformIgnorePatterns: ['node_modules/(?!@gobletqa|!@keg-hub)/'],
  testPathIgnorePatterns: [
    `/node_modules/`,
    `/__mocks__`,
  ]
}