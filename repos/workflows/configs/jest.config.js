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
    "^@GWF/git$": path.join(__dirname, "../src/git"),
    "^@GWF$": path.join(__dirname, "../src"),
    "^@GConfigs/(.*)$": path.join(__dirname, "../../../configs/$1"),
    "^@gobletqa/shared/(.*)$": path.join(__dirname, "../../shared/src/$1"),
    "^@gobletqa/shared$": path.join(__dirname, "../../shared/src"),
    "^@gobletqa/workflows/types$": path.join(__dirname, "../src/types"),
    "^@gobletqa/workflows/types/(.*)$": path.join(__dirname, "../src/types/$1"),
    "^@gobletqa/workflows$": path.join(__dirname, "../src"),
    "^@gobletqa/workflows/(.*)$": path.join(__dirname, "../src/$1"),
  },
}
