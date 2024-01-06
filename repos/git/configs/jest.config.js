const path = require('path')
const rootDir = path.join(__dirname, `..`)
const baseCfg = require('@gobletqa/configs/jest.base.config.js')
module.exports = {
  ...baseCfg,

  /* ---- Service specific options here ---- */
  rootDir,
  setupFilesAfterEnv: [`${rootDir}/scripts/jest.setup.ts`],
  collectCoverageFrom: ['**/*.ts', '!**/*.types.ts', '!**/*.d.ts'],
  transformIgnorePatterns: ['node_modules/(?!@gobletqa|!@keg-hub)/'],
  moduleNameMapper: {
    ...baseCfg.moduleNameMapper,
  },
}
