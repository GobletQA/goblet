import { setSharedOptions } from '@keg-hub/cli-utils'
import { ArtifactSaveOpts } from '@gobletqa/browser'

const artifactSaveOpts = Object(ArtifactSaveOpts).values

const dynamicOpts = {
  version: (type=`<cmd>`, action=`<action>`) => ({
    version: {
      alias: [`ver`],
      example: `${type} ${action} --version minor`,
      description: `The new version of goblet`,
    },
    confirm: {
      default: false,
      alias: [`conf`],
      example: `${type} ${action} --no-confirm`,
      description: `Ask to confirm version before updating`,
    },
    log: {
      default: true,
      alias: [`lg`],
      example: `${type} ${action} --no-log`,
      description: `Log output of the task`,
    },
  }), 
  deploy: (type=`<cmd>`, action=`<action>`) => ({
    mode: {
      allowed: [`vnc`, `local`],
      example: `${type} ${action} --mode local`,
      description:
        `Mode to run goblet in. In not set, uses launch option`,
    },
    local: {
      allowed: [`lc`],
      example: `${type} ${action} --local`,
      description: `Build goblet in local mode. Same as '--mode local' option`,
    },
    vnc: {
      example: `${type} ${action} --vnc`,
      description: `Build goblet in vnc mode. Same as '--mode vnc' option`,
    },
  }),
}

const taskOptions = {
  test: {
    noTests: {
      description: `The test runner will not fail when no tests exit`,
      example: `--noTests`,
      default: false,
    },
    testSync: {
      default: true,
      type: `boolean`,
      alias: [`runInBand`],
      example: `--no-testSync`,
      description: `Run all tests sequentially`,
    },
    testBail: {
      alias: [`bail`],
      example: `--testBail`,
      env: `GOBLET_TEST_BAIL`,
      description: `Stops all tests once a single step fails`,
    },
    testConfig: {
      enforced: true,
      example: `--testConfig relative/path/to/config`,
      description: `Absolute path to a test config relative to the root directory`,
    },
    testTimeout: {
      alias: [`timeout`],
      env: `GOBLET_TEST_TIMEOUT`,
      example: `--timeout 20000`,
      description: `Test timeout in milliseconds`,
    },
    testDebug: {
      default: false,
      type: `boolean`,
      example: `--testDebug`,
      env: `GOBLET_TEST_DEBUG`,
      description: `Pass the --debug flag to the test command`,
    },
    testRetry: {
      example: `--testRetry 3`,
      alias: [`retry`, `tr`],
      env: `GOBLET_TEST_RETRY`,
      description: `Amount of times to retry the test if it fails`,
    },
    suiteRetry: {
      example: `--suiteRetry 3`,
      alias: [`sretry`, `sr`],
      env: `GOBLET_SUITE_RETRY`,
      description: `Amount of times to retry the suite when a child test fails`,
    },
    suiteTimeout: {
      alias: [`st`, `stimeout`],
      env: `GOBLET_SUITE_TIMEOUT`,
      example: `--suiteTimeout 36000`,
      description: `Suite timeout in milliseconds.`,
    },
    testReport: {
      alias: [`report`],
      default: `failed`,
      example: `--testReport`,
      env: `GOBLET_TEST_REPORT`,
      allowed: artifactSaveOpts,
      description: `Generate an html report for a test suite based on the test state`,
    },
    testCache: {
      default: true,
      type: `boolean`,
      example: `--testCache`,
      env: `GOBLET_TEST_CACHE`,
      description: `Use internal test cache when executing test`,
    },
    testColors: {
      default: false,
      type: `boolean`,
      example: `--testColors`,
      env: `GOBLET_TEST_COLORS`,
      description: `Force use of colors even when not a TTY`,
    },
    testWorkers: {
      example: `--testWorkers`,
      env: `GOBLET_TEST_WORKERS`,
      description: `Number of workers to use when running tests`,
    },
    testVerbose: {
      default: false,
      type: `boolean`,
      alias: [`verbose`],
      example: `--testVerbose`,
      env: `GOBLET_TEST_VERBOSE`,
      description: `Output verbose test results as the tests run`,
    },
    testOpenHandles: {
      default: false,
      type: `boolean`,
      example: `--testOpenHandles`,
      env: `GOBLET_TEST_OPEN_HANDLES`,
      description: `Detect handles left open when tests run. Forces tests to run in sync.`,
    },
    testCI: {
      default: false,
      type: `boolean`,
      example: `--testCI`,
      env: `GOBLET_RUN_FROM_CI`,
      description: `Run the tests in CI mode when running in a CI environment`,
    },
    exitOnFailed: {
      default: false,
      type: `boolean`,
      alias: [`eof`, `exit`],
      example: `--exitOnFailed`,
      env: `GOBLET_EXIT_ON_FAILED`,
      description: `Stop running test and exit the process is a test fails`,
    },
    skipAfterFailed: {
      default: true,
      type: `boolean`,
      alias: [`saf`, `skip`],
      example: `--skipAfterFailed`,
      description: `When a test fails, skip all future tests within in the same suite`,
    },
  },
  docker: {
    container: {
      description: `Name of container within which to run create command`,
      example: `--container goblet`,
      default: `goblet`,
    },
  },
  bdd: {
    tags: {
      description:
        `Comma separated list of tags which determine which feature files are run`,
      alias: [`tag`, `tg`],
      type: `array`,
      default: [],
      example: `--tags @foo,@bar,@baz`,
    },
    filter: {
      alias: [`filters`, `fl`],
      description:
        `Filters test (feature and scenario names) by this substring. If not passed, all tests are run. Does nothing when context option is passed`,
      type: `array`,
      default: [],
      example: `--filter auth`,
    },
  },
  goblet: {
    context: {
      alias: [`name`],
      description:
        `Path or name of the test file to run. If not passed, all tests are run.`,
      example: `--context <value>`,
      default: null,
    },
    log: {
      alias: [`lg`],
      description: `Log task output`,
      type: `bool`,
      default: true,
      example: `--no-log`,
    },
    mode: {
      allowed: [`vnc`, `local`],
      example: `--mode local`,
      description: `Mode to run goblet in. In not set, uses launch option`,
    },
    base: {
      env: `GOBLET_CONFIG_BASE`,
      alias: [`baseDir`, `rootDir`, `root`],
      example: [`--base /my/test/repo/directory`],
      description: `The root or base directory containing a goblet.config outside of Goblet root directory`,
    },
    repo: {
      alias: [ `cwd`, `workdir`, `repoDir`],
      description: `Root directory to run the command from`,
      example: `--repo /path/to/repo/root`
    },
  },
  playwright: {
    concurrent: {
      default: false,
      alias: [`async`],
      example: `--concurrent` ,
      env: `GOBLET_BROWSER_CONCURRENT`,
      description: `Run the defined browsers concurrently`,
    },
    browsers: {
      type: `array`,
      alias: [`browser`],
      env: `GOBLET_BROWSERS`,
      example: `--browsers chrome,wk` ,
      description: `Launch a specific browser by name. Seperate by comma to launch multiple`,
      allowed: [`chromium`, `chrome`, `ch`, `firefox`, `ff`, `webkit`, `wk`, `safari`, `sa`],
    },
    allBrowsers: {
      alias: [`all`],
      description: `Launch all supported browsers`,
      type: `bool`,
      example: `--all`,
    },
    chromium: {
      alias: [`chrome`, `chrom`, `ch`],
      description: `Launch Chromium browser through Playwright`,
      type: `bool`,
      example: `--chrome`,
    },
    firefox: {
      type: `bool`,
      example: `--firefox`,
      alias: [`fire`, `fox`, `ff`],
      description: `Launch Firefox browser through Playwright`,
    },
    webkit: {
      type: `bool`,
      example: `--webkit`,
      alias: [`webkit`, `safari`, `sa`],
      description: `Launch Safari browser through Playwright`,
    },
    headless: {
      type: `bool`,
      alias: [`hl`],
      default: true,
      env: `GOBLET_HEADLESS`,
      example: `--no-headless`,
      description: `Launch the browser in headless mode`,
    },
    slowMo: {
      default: 100,
      type: `number`,
      example: `--slowMo 500`,
      env: `GOBLET_BROWSER_SLOW_MO`,
      description: `Speed actions within the browser will be performed in milliseconds`,
    },
    browserTimeout: {
      type: `number`,
      alias: [`bt`, `btimeout`],
      env: `GOBLET_BROWSER_TIMEOUT`,
      example: `--browserTimeout 15000`, // 15 seconds
      description: `Amount of time until a browser request will timeout should be less the timeout option`,
    },
    devices: {
      type: `array`,
      alias: [`device`],
      env: `GOBLET_BROWSER_DEVICES`,
      example: `--devices Pixel-2,Galaxy-S5-landscape`,
      description: `Comma separated list of devices to emulate running a browser. Spaces in device names should use a "-" instead.  See https://github.com/microsoft/playwright/blob/5ba7903ba098586a13745e0d7ac894f1d55d47aa/packages/playwright-core/src/server/deviceDescriptorsSource.json for a list of devices.`,
    },
    launchType: {
      default: `launch`,
      env: `GOBLET_BROWSER_LAUNCH_TYPE`,
      example: `--launchType persistent`,
      allowed: [`launch`, `l`, `persistent`, `p`, `server`, `s`],
      description: `Sets the playwright browser launch type method used to launch the browser`,
    },
    debug: {
      default: false,
      env: `GOBLET_BROWSER_DEBUG`,
      description: `Runs with playwright debug mode activated`,
      example: `keg goblet bdd test --debug`,
    },
    devtools: {
      type: `boolean`,
      default: false,
      example: `--devtools`,
      env: `GOBLET_DEV_TOOLS`,
      description: `Open devtools automatically when the browser opens. The debug option must also be set true`,
    },
    tracing: {
      default: `failed`,
      allowed: artifactSaveOpts,
      env: `GOBLET_TEST_TRACING`,
      example: `--tracing failed`,
      description: `Activates playwrights tracing functionality for all executed tests`,
    },
    screenshot: {
      type: `boolean`,
      default: false,
      example: `--screenshot`,
      env: `GOBLET_TEST_SCREENSHOT`,
      description: `Activates playwrights tracing functionality for all executed tests`,
    }
  },
  pwContext: {
    width: {
      type: `number`,
      example: `--width 1080`,
      description: `The width of the browser window`,
    },
    height: {
      type: `number`,
      example: `--height 720`,
      description: `The height of the browser window`,
    },
    appUrl: {
      example: `--appUrl https://google.com`,
      description: `The default url a browser will navigate to when running`,
    },
    downloads: {
      example: `--downloads`,
      description: `The accept downloads from visited pages. Downloads automatically cancelled by default`,
    },
    geolocation: {
      type: `array`,
      alias: [`geo`],
      example: `--geolocation 85,134`,
      description: `Emulate a custom geolocation, in the format of <latitude>,<longitude>`
    },
    hasTouch: {
      alias: [`touch`],
      example: `--hasTouch`,
      description: `Sets viewport to supports touch events`
    },
    isMobile: {
      example: `--isMobile`,
      description: `Sets the meta viewport tag to be accounted for and enables touch events`
    },
    permissions: {
      type: `array`,
      example: `--permissions gyroscope,notifications`,
      description: `A list of permissions to grant to all browser pages, seperated by comma`
    },
    record: {
      allowed: artifactSaveOpts,
      example: `--record failed`,
      env: `GOBLET_TEST_VIDEO_RECORD`,
      description: `Records a video of browser interactions based on a condition. Saves to config#artifactsDir/videos`
    },
    // TOODO: Need to investigate this further
    // storageState: {},
    timezone: {
      example: `--timezone America/Los_Angeles`,
      description: `Emulate running the browser in a specific timezone`
    },
    reuseContext: {
      type: `bool`,
      example: `--reuseContext`,
      env: `GOBLET_CONTEXT_REUSE`,
      description: `Reuse the same context for each test`
    },
    reusePage: {
      type: `bool`,
      example: `--reusePage`,
      env: `GOBLET_PAGE_REUSE`,
      description: `Reuse the same page for each test`
    },
    artifactsDebug: {
      default: false,
      type: `boolean`,
      env: `GOBLET_ARTIFACTS_DEBUG`,
      alias: [ `artDebug`, `artD`, `adebug` ],
      description: `Enable debug logs for artifacts generated durring test execution`,
      example: `keg goblet bdd test --artifactsDebug`,
    },
  },
  waypoint: {
  },
}

setSharedOptions({
  ...taskOptions.test,
  ...taskOptions.docker,
  ...taskOptions.goblet,
  ...taskOptions.playwright,
  ...taskOptions.pwContext,
  ...taskOptions.test,
  ...taskOptions.bdd,
})
