import type { TTestMatch } from '@gobletqa/shared/utils/buildTestMatchFiles'

import os from "os"
import path from 'path'
import { Logger } from '@keg-hub/cli-utils'
import { jestAliases } from './setupTestAliases'
import { noOpObj, noPropArr, capitalize } from '@keg-hub/jsutils'
import { getGobletConfig } from '@gobletqa/shared/goblet/getGobletConfig'
import { buildTestMatchFiles } from '@gobletqa/shared/utils/buildTestMatchFiles'

export type TJestConfOpts = TTestMatch & {
  title?:string
  rootDir?:string
  testDir?:string
  reportOutputPath?:string
}

/**
 * Builds the test reports, currently only jest-html-reporter
 * TODO: allow reporters to be more customizable
 * @param {Object} opts - Custom options for the tests being run
 * @param {Object} config - Global Goblet config
 *
 * @returns {Array} - Built reporters array
 */
const buildReporters = (
  opts:TJestConfOpts=noOpObj,
  gobletRoot:string,
) => {
  const {
    GOBLET_HTML_REPORTER_PAGE_TITLE,
    GOBLET_HTML_REPORTER_OUTPUT_PATH,
  } = process.env
  const title = opts.title || opts.type

  // TODO: check the goblet config for a custom jest reporter
  // Then add it to the reporters array
  // const reporters = [`default`] as any[]
  const reporters = [] as any[]

  GOBLET_HTML_REPORTER_OUTPUT_PATH &&
    reporters.push([
      // Since the root is not keg-config, we have to define the full path to the reporter
      `${gobletRoot}/node_modules/jest-html-reporter`,
      {
        includeFailureMsg: true,
        includeSuiteFailure: true,
        outputPath: opts.reportOutputPath || GOBLET_HTML_REPORTER_OUTPUT_PATH,
        pageTitle: GOBLET_HTML_REPORTER_PAGE_TITLE || `${title ? capitalize(title) : ``} Test Results`.trim(),
      },
    ])

  return reporters
}

/**
 * Default config that other jest configs can use to set common config properties
 * @param {Object} config - Global Goblet config
 * @param {Object} opts - Custom options for the tests being run
 * @param {string} [opts.rootDir=/keg] - Absolute path to the root jest test directory
 * @param {string} opts.testDir - Absolute path to the folder containing tests to run
 * @param {string} opts.title - Test reporter title
 * @param {string} opts.type - Type of tests being run, tagged as part of the name
 * @param {string} opts.ext - Extension of the test files to find
 * @param {string} opts.shortcut - Shortcut of the test type
 * 
 * @returns {Object} - Jest config object
 */
export const jestConfig = (config, opts:TJestConfOpts=noOpObj) => {
  const {
    GOBLET_CONFIG_BASE,
    GOBLET_MOUNT_ROOT,
    GOBLET_TEST_DEBUG
  } = process.env

  GOBLET_TEST_DEBUG &&
    Logger.stdout(`[Goblet] Loaded Config:\n${JSON.stringify(config, null, 2)}\n`)

  config = config || getGobletConfig()
  const { gobletRoot } = config.internalPaths

  const testMatch = opts.testDir && (opts.type || opts.shortcut || opts.ext)
    ? buildTestMatchFiles(opts.testDir, opts)
    : noPropArr

  return {
    testMatch,
    // TODO: investigate using jest-circus at some point
    testRunner: `jest-jasmine2`,
    reporters: buildReporters(opts, gobletRoot),
    moduleFileExtensions: [
      `js`,
      `jsx`,
      `cjs`,
      `mjs`,
      `json`,
      `ts`,
      `tsx`
    ],
    // This seems to be needed based on how the github action is setup
    // But it may be a better option then sym-linking the keg-config node_modules to ~/.node_modules
    // Need to investigate it
    modulePaths: [
      path.join(GOBLET_CONFIG_BASE, `node_modules`),
      path.join(gobletRoot, `node_modules`),
      path.join(os.homedir(), `.node_modules`)
    ],
    moduleNameMapper: jestAliases,
    globals: {
      __DEV__: true,
    },
    // Jest no loading tests outside of the rootDir
    // So set the root to be the parent of keg-config and the repos dir
    // If no rootDir override is set
    rootDir: opts.rootDir || GOBLET_MOUNT_ROOT || `/goblet`,
    transform: {
      '\\.[jt]sx?$': ['esbuild-jest', { sourcemap: true }],
      '\\.(js|jsx|mjs|cjs|ts|tsx)?$': [`esbuild-jest`, { sourcemap: true }],
    },
  }
}
