const path  = require('path')
const rootDir = path.join(__dirname, `..`)
const { jestAliases } = require('./aliases.config')

module.exports = {
  verbose: false,
  clearMocks: true,
  maxWorkers: '50%',
  testEnvironment: 'node',
  coverageProvider: 'v8',
  roots: ['<rootDir>/src'],
  globals: {
    __DEV__: true,
  },
  testMatch: [
    '<rootDir>/**/*.spec.{js,jsx,ts,tsx}',
    '<rootDir>/**/*.test.{js,jsx,ts,tsx}',
    '<rootDir>/**/__tests__/*.{js,jsx,ts,tsx}',
  ],
  transform: {
    '\\.[jt]sx?$': [`esbuild-jest`, {
      target: `esnext`,
      sourcemap: true
    }],
    '\\.(js|jsx|mjs|cjs|ts|tsx)?$': [`esbuild-jest`, {
      target: `esnext`,
      sourcemap: true,
    }],
  },
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['lcov', 'text-summary', 'text', 'html'],
  collectCoverageFrom: [
    '**/*.{js,jsx,ts,tsx}',
    '!**/bin/**',
    '!**/*.d.ts',
    '!**/coverage/**',
    '!**/__tests__/**',
    '!**/node_modules/**',
    '!**/*.spec.{js,jsx,ts,tsx}',
    '!**/*.test.{js,jsx,ts,tsx}',
  ],
  coveragePathIgnorePatterns: ['/node_modules/'],
  moduleNameMapper: {
    ...jestAliases,
    [`^@keg-hub/jsutils/node`]: `${rootDir}/node_modules/@keg-hub/jsutils/build/esm/node/index.js`,
    [`^@keg-hub/jsutils/node/(.*)`]: `${rootDir}/node_modules/@keg-hub/jsutils/build/esm/node/$1`,
    [`^@keg-hub/jsutils/src/node`]: `${rootDir}/node_modules/@keg-hub/jsutils/build/esm/node/index.js`,
    [`^@keg-hub/jsutils/src/node/(.*)`]: `${rootDir}/node_modules/@keg-hub/jsutils/build/esm/node/$1`,
    [`^@keg-hub/jsutils`]: `${rootDir}/node_modules/@keg-hub/jsutils/build/esm/index.js`,
    [`^@keg-hub/jsutils/(.*)`]: `${rootDir}/node_modules/@keg-hub/jsutils/build/esm/$1`,
  }
}
