const path = require('path')
const rootDir = path.join(__dirname, `..`)

module.exports = {
  ...require('../../../configs/jest.base.config.js'),

  /* ---- Service specific options here ---- */
  rootDir,
  setupFilesAfterEnv: [`${rootDir}/scripts/jest.setup.ts`],
  collectCoverageFrom: ['**/*.ts', '!**/*.types.ts', '!**/*.d.ts'],
  transformIgnorePatterns: ['node_modules/(?!@gobletqa|!@keg-hub)/'],
  moduleNameMapper: {
    "^@GLT/services$": path.join(__dirname, "../src/services"),
    "^@GLT/services/(.*)$": path.join(__dirname, "../src/services/$1"),
    "^@GLT/types$": path.join(__dirname, "../src/types"),
    "^@GLT/types/(.*)$": path.join(__dirname, "../src/types/$1"),
    "^@GLT$": path.join(__dirname, "../src"),
    "^@GLT/(.*)$": path.join(__dirname, "../src/$1"),
    "^@GConfigs/(.*)$": path.join(__dirname, "../../../configs/$1")
  },
}
