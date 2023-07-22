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
    "^@GConfigs/(.*)$": path.join(__dirname, "../../../configs/$1"),
    "^@GEnv$": path.join(__dirname, "../shared/src/environment/environment"),
    "^@GException$": path.join(__dirname, "../shared/src/exceptions/Exception"),
    "^@GEnv/values$": path.join(__dirname, "../shared/src/environment/values"),
    "^@GEnv/secrets$": path.join(__dirname, "../shared/src/environment/secrets"),
    "^@GEnvironment$": path.join(__dirname, "../shared/src/environment/environment"),
    "^@GEnvironment/values$": path.join(__dirname, "../shared/src/environment/values"),
    "^@GEnvironment/secrets$": path.join(__dirname, "../shared/src/environment/secrets"),
    "^@gobletqa/shared$": path.join(__dirname, "../../shared/src"),
    "^@gobletqa/shared/(.*)$": path.join(__dirname, "../../shared/src/$1"),
  },
}
