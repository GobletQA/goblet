import { ExamEvents } from '@GEX/Events'

export const cliOpts = {
  testMatch: [],
  testIgnore: [],
  transformIgnore: [],
  loaderIgnore: [],
  timeout: 30000,
  globalTimeout: 1200000,
  extensions: [
    '.js',  '.jsx',
    '.cjs', '.mjs',
    '.ts',  '.cts',
    '.mts', '.tsx'
  ],
  preRunner: [],
  postRunner: [],
  preEnvironment: [],
  postEnvironment: [],
  config: '__mocks__/exam.config.ts',
  envs: {},
  globals: {},
  esbuild: {},
  environment: {},
  events: ExamEvents,
  runners: {},
  transforms: {},
  environments: {},
  reporters: {},
  env: 'development'
}