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
    "^@GEX/services$": path.join(__dirname, "../src/services"),
    "^@GEX/services/(.*)$": path.join(__dirname, "../src/services/$1"),
    "^@GEX/types$": path.join(__dirname, "../src/types"),
    "^@GEX/types/(.*)$": path.join(__dirname, "../src/types/$1"),
    "^@GEX$": path.join(__dirname, "../src"),
    "^@GEX/(.*)$": path.join(__dirname, "../src/$1"),
  },
}
