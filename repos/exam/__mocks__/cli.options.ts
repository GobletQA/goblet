
export const cliOpts = {
  // --- Not Implemented
  silent: false,
  colors: true,
  // --- Not Implemented


  bail:0,
  testRetry:0,
  suiteRetry:0,
  exitOnFailed: false,
  skipAfterFailed: true,
  cache: true,
  workers: 1,
  concurrency: 1,
  testMatch: [],
  testIgnore: [],
  runInBand: false,
  reuseRunner:true,
  transformIgnore: [],
  loaderIgnore: [],
  passWithNoTests: false,
  // 15 second test timeout
  testTimeout: 15000,
  // 1hr global test timeout
  suiteTimeout: 60000 * 60,
  matchExtensions: false,
  extensions: [
    `.js`,  `.jsx`,
    `.cjs`, `.mjs`,
    `.ts`,  `.cts`,
    `.mts`, `.tsx`
  ],
  preRunner: [],
  postRunner: [],
  preEnvironment: [],
  postEnvironment: [],
  config: `__mocks__/exam.config.ts`,
  envs: {},
  globals: {},
  esbuild: {},
  runners: {},
  transforms: {},
  environment: ``,
  reporters: undefined,
  
  env: `development`,
}