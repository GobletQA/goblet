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
        blacklist: [
          `IMAGE_TAG`,
          `GB_CM_*`,
          `DOCKER_REGISTRY`,
          `*_CERT_ISSUER`,
          `GB_IMAGE_BUILD_TAGS`,
          `GB_IMAGE_FROM`,
          `*_DOC_VOLUMES`,
          `GB_LINODE_TOKEN`,
          `GB_BUILD_PLATFORMS`,
        ]
      }
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
        blacklist: [
          `GB_FE_*`,
          `DISPLAY`
        ]
      }
    },
    app: {
      contexts: [`app`],
    },
    dind: {
      contexts: [`dind`, `dnd`, `dd`],
    },
    frontend: {
      contexts: [`frontend`, `fre`, `fe`],
    },
    screencast: {
      contexts: [`screencast`, `scr`, `sc`],
    }
  },
}
