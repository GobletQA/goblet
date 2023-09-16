module.exports = {
  // Default environment argument to allow short cuts when setting an env
  environment: {
    options: ['environment', 'env', 'e'],
    map: {
      production: ['production', 'prod', 'p'],
      qa: ['qa', 'q'],
      develop: ['development', 'develop', 'dev', 'd'],
      local: ['local', 'loc', 'l'],
      test: ['test', 'tst', 't'],
    },
  },

  // Default args passed to all tasks
  defaultArgs: {
    env: {
      alias: [ 'environment' ],
      description: 'Environment to run the task in',
      example: '<command> --env staging',
      default: 'development',
    },
    devspace: {
      alias: [`dsp`, `ds`, `dev`],
      example: '<command> --devspace staging',
      default: `container/devspace.yaml`,
      description: `Optional filepath for devspace.yaml file`,
    },
  },

  // Task parsing settings
  settings: {
    defaultEnv: 'local',
    task: {
      optionsAsk: false,
    },
  },
  domains: {
    default: {
      host: `local.gobletqa.app`
    },
    local: {
      host: `local.gobletqa.app`
    }
  },
  apps: {
    default: {
      /**
      * ENV prefix to append to all dynamically set envs durning lookup
      */
      prefix: `GB`,
      /**
      * Prefix used for the injected kubernetes ENV
      */
      servicePrefix: `GOBLET`,
      envs: {
        omit: [
          `KEG_*`,
          `DOC_*`,
          `EXPO_*`,
          `IMAGE`,
          `GIT_CLI_*`,
          `GIT_HUB_*`,
          `IMAGE_TAG`,
          `FIRE_BASE_*`,
          `GB_BE_IMAGE`,
          `*_IMAGE_FROM`,
          `GB_IMAGE_FROM`,
          `*_DOC_VOLUMES`,
          `GITHUB_CLIENT_*`,
          `GITLAB_CLIENT_*`,
          `GB_BE_IMAGE_TAG`,
          `FIREBASE_TOKEN_*`,
          `GB_KUBE_CONTEXT`,
          `GB_KUBE_NAMESPACE`,
          `*_DEVSPACE_CONFIG`,
          `GB_IMAGE_BUILD_TAGS`,
          `BUILDKIT_INLINE_CACHE`
        ]
      },
      sync: {
        localSubPath: `../`,
        disableDownload: true,
        initialSync: `mirrorLocal`,
        containerPath: `/goblet/app`,
        excludePaths: [
          '.*',
          '!/tsconfig.json',
          '!/configs',
          '!/container',
          'node_modules',
          'node_modules/**',
          'container/scripts',
          'container/.devspace',
          'container/templates',
        ]
      }
    },
    app: {
      contexts: [`app`],
    },
    action: {
      contexts: [`action`, `act`],
      sync: {
        excludePaths: [
          '**',
          '!/tsconfig.json',
          '!/repos/exam',
          '!/repos/repo',
          '!/repos/goblet',
          '!/repos/latent',
          '!/repos/shared',
          '!/repos/logger',
          '!/repos/browser',
          '!/repos/workflows',
          '!/repos/testUtils',
          '!/repos/environment',
          // Ignore the dist folders so local bundles are not synced
          '!/repos/logger/dist',
          '/repos/browser/dist',
          '/repos/exam/dist',
          '!/repos/goblet/dist',
          '/repos/latent/dist',
          '/repos/shared/dist',
          '/repos/repo/dist',
          '/repos/workflows/dist',
          '/repos/testUtils/dist',
          '/repos/environment/dist',
        ]
      },
      envs: {
        omit: [
          `GB_CR_*`,
          `GB_FE_*`,
          `FIRE_BASE_*`
        ]
      }
    },
    base: {
      contexts: [`base`, `bs`],
    },
    backend: {
      /**
      * Contexts to reference durning task execution
      */
      contexts: [`backend`, `be`],
      portForward: {
        ports: [
          `GB_BE_PORT`,
        ]
      },
      sync: {
        excludePaths: [
          '**',
          '!/tsconfig.json',
          '!/repos/backend',
          '!/repos/conductor',
          '!/repos/environment',
          '!/repos/goblet',
          '!/repos/joker',
          '!/repos/logger',
          '!/repos/repo',
          '!/repos/shared',
          '!/repos/workflows',
          // Ignore the dist folders so local bundles are not synced
          '/repos/repo/dist',
          '/repos/goblet/dist',
          '/repos/logger/dist',
          '/repos/shared/dist',
          '/repos/backend/dist',
          '/repos/workflows/dist',
          '/repos/conductor/dist',
          '/repos/environment/dist',
        ]
      },
      envs: {
        // Any keys specifically set will get picked
        // Wildcards can be overwritten by omit list
        pick: [
          `NODE_ENV`,
          `GOBLET_*`,
          `GB_BE_*`,
          `GB_SC_*`,
          `GB_KD_*`,
          `GB_DD_*`,
          `GB_CD_*`,
          `GB_NO_*`,
          `GB_VNC_*`,
          `GB_OPEN_AI_*`,
          `GB_LEPTON_AI_*`,
          `GB_JK_AI_*`,
          `EXAM_*`,
          `DISPLAY`,
          `PLAYWRIGHT_*`,
          `GOBLET_KIND_*`,
          `GB_SC_ACTIVE`,
          `GB_LOG_LEVEL`,
          `GB_KUBE_CONTEXT`,
          `GB_KUBE_NAMESPACE`,
          `GB_SERVER_ORIGINS`,
          `GB_LOCAL_DEV_MODE`,
          `GB_GIT_REMOTE_REF`,
          `GB_LT_TOKEN_SECRET`,
          `GB_GIT_PROVIDER_DATA`,
          `GB_GIT_GLOBAL_IGNORE`,
        ],
        /**
        * ENVs to not include in the backend
        * Will not be omitted if same env is in the pick list
        * But will override wildcards in the pick list when more specific
        * i.e. If pick list has `FIRE_BASE_*`, and omit list has `FIRE_BASE_SERVICE_ACCOUNT`
        * All ENVs with `FIRE_BASE_` will be picked except for FIRE_BASE_SERVICE_ACCOUNT
        * It will be omitted due to being in the omit list, and more specific
        */
        omit: [
          `GB_CR_*`,
          `GB_FE_*`,
          `FIRE_BASE_*`,
        ],
      }
    },
    frontend: {
      contexts: [`frontend`, `fe`],
      portForward: {
        ports: [
          `GB_FE_PORT`,
        ]
      },
      sync: {
        excludePaths: [
          'temp',
          'logs',
          'tasks',
          'certs',
          'goblet',
          'repos/backend',
          'repos/browser',
          'repos/conductor',
          '/repos/repo',
          'repos/exam',
          'repos/latent',
          'repos/logger',
          'repos/scripts',
          'repos/screencast',
        ]
      },
      envs: {
        // Will not be omitted if same env is in the pick list
        // But will override wildcards in the pick list when more specific
        // i.e. If pick list has `FIRE_BASE_*`, and omit list has `FIRE_BASE_SERVICE_ACCOUNT`
        // All ENVs with `FIRE_BASE_` will be picked except for FIRE_BASE_SERVICE_ACCOUNT
        // It will be omitted due to being in the omit list, and more specific
        omit: [
          `FIRE_BASE_SERVICE_ACCOUNT`
        ],
        // Any keys specifically set will get picked
        // Wildcards can be overwritten by omit list
        pick: [
          `NODE_ENV`,
          `GB_FE_PORT`,
          `GB_BE_PORT`,
          `GB_SC_PORT`,
          `GB_BE_HOST`,
          `EXAM_*`,
          `FIRE_BASE_*`,
          `GB_VNC_ACTIVE`,
          `GB_NO_VNC_PATH`,
          `GB_BE_WS_PATH`,
          `GB_WS_TRANSPORTS`,
          `GB_VNC_VIEW_WIDTH`,
          `GB_VNC_VIEW_HEIGHT`,
          `GB_PW_SOCKET_ACTIVE`,
          `GB_GITHUB_AUTH_USERS`,
        ]
      }
    },
    screencast: {
      contexts: [`screencast`, `sc`],
      sync: {
        excludePaths: [
          '**',
          '!/tsconfig.json',
          '!/repos/exam',
          '!/repos/repo',
          '!/repos/latent',
          '!/repos/logger',
          '!/repos/goblet',
          '!/repos/joker',
          '!/repos/shared',
          '!/repos/browser',
          '!/repos/testUtils',
          '!/repos/workflows',
          '!/repos/screencast',
          '!/repos/environment',
          '!/tasks',
          // Ignore the dist folders so local bundles are not synced
          '/repos/exam/dist',
          '/repos/repo/dist',
          '/repos/logger/dist',
          '/repos/goblet/dist',
          '/repos/shared/dist',
          '/repos/browser/dist',
          '/repos/testUtils/dist',
          '/repos/workflows/dist',
          '/repos/screencast/dist',
          '/repos/environment/dist',
        ]
      },
      envs: {
        omit: [
          `GB_CR_*`,
          `GB_FE_*`,
          `FIRE_BASE_*`
        ]
      }
    },
    playwright: {
      contexts: [`playwright`, `pw`],
    },
  },
}
