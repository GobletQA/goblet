
export const cliOpts = {
  // --- Not Implemented
  testRetry:0,
  suiteRetry:0,
  silent: false,
  colors: true,
  // --- Not Implemented


  bail:0,
  cache: true,
  workers: 1,
  concurrency: 1,
  testMatch: [],
  testIgnore: [],
  runInBand: false,
  transformIgnore: [],
  loaderIgnore: [],
  timeout: 30000,
  passWithNoTests: false,
  globalTimeout: 1200000,
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