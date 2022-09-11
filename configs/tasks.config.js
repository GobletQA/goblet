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

  // Task parsing settings
  settings: {
    defaultEnv: 'local',
    task: {
      optionsAsk: false,
    },
  },
  
  apps: {
    _all: {
      /**
      * ENV prefix to append to all dynamically set envs durning lookup
      */
      prefix: `GB`,
      envs: {
        omit: [
          `KEG_*`,
          `DOC_*`,
          `EXPO_*`,
          `IMAGE`,
          `GIT_CLI_*`,
          `GIT_HUB_*`,
          `GB_KUBE_*`,
          `IMAGE_TAG`,
          `FIRE_BASE_*`,
          `GB_BE_IMAGE`,
          `*_IMAGE_FROM`,
          `GB_IMAGE_FROM`,
          `*_DOC_VOLUMES`,
          `GITHUB_CLIENT_*`,
          `GB_BE_IMAGE_TAG`,
          `*_DEVSPACE_CONFIG`,
          `GB_IMAGE_BUILD_TAGS`,
          `FIREBASE_TOKEN_*`
        ]
      },
      sync: {
        ignore: [
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
    backend: {
      /**
      * Contexts to reference durning task execution
      */
      contexts: [`backend`, `bae`, `be`],
      envs: {
        /**
        * ENVs to not include in the backend
        */
        omit: [
          `GB_CR_*`,
          `GB_FE_*`,
          `FIRE_BASE_*`,
        ],
      }
    },
    dind: {
      contexts: [`dind`, `dnd`, `dd`],
      envs: {
        /**
        * ENVs to not include in the backend
        */
        omit: [
          `GB_BE_*`,
          `GB_CR_*`,
          `GB_FE_*`,
          `FIRE_BASE_*`
        ]
      }
    },
    frontend: {
      contexts: [`frontend`, `fre`, `fe`],
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
      contexts: [`screencast`, `scr`, `sc`],
      envs: {
        omit: [
          `GB_CR_*`,
          `GB_FE_*`,
          `FIRE_BASE_*`
        ]
      }
    }
  },
}
