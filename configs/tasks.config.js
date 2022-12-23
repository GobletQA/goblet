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
          `GB_BE_IMAGE_TAG`,
          `FIREBASE_TOKEN_*`,
          `GB_KUBE_CONTEXT`,
          `GB_KUBE_NAMESPACE`,
          `*_DEVSPACE_CONFIG`,
          `GB_IMAGE_BUILD_TAGS`,
        ]
      },
      sync: {
        localSubPath: `../`,
        disableDownload: true,
        initialSync: `mirrorLocal`,
        containerPath: `/goblet/app`,
        excludePaths: [
          '.*',
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
      envs: {
        values: {
          imageTag: `latest`,
          image: `ghcr.io/gobletqa/goblet-action`,
          imageFrom: `mcr.microsoft.com/playwright:v1.27.0-focal`,
        }
      },
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
          '!/repos/backend',
          '!/repos/conductor',
          '!/repos/screencast',
          '!/repos/shared',
          '!/repos/esdev',
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
          `DISPLAY`,
          `PLAYWRIGHT_*`,
          `GOBLET_KIND_*`,
          `GB_LOG_LEVEL`,
          `GB_KUBE_CONTEXT`,
          `GB_KUBE_NAMESPACE`,
          `GB_SERVER_ORIGINS`,
          `GB_LOCAL_DEV_MODE`,
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
          'repos/scripts',
          'repos/backend',
          'repos/conductor',
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
          '!/repos/screencast',
          '!/repos/shared',
          '!/repos/testUtils',
          '!/repos/workflows',
          '!/tasks',
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
  },
}
