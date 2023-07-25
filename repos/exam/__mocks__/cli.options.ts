import { ExamEvents } from '@GEX/Events'

export const cliOpts = {
  // --- Not Implemented
  workers: 1,
  testRetry:0,
  suiteRetry:0,
  colors: true,
  concurrency: 1,
  silent: false,
  runInBand: false,
  // --- Not Implemented


  bail:0,
  cache: true,
  testMatch: [],
  testIgnore: [],
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
  environment: {},
  events: ExamEvents,
  runners: {},
  transforms: {},
  environments: {},
  reporters: {},
  
  env: `development`,
}