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

  // TODO: move this config to values.yml files
  // Then use it to blacklist and whitelist envs
  envs: {
    whitelist: [],
    blacklist: [
      `GB_CERT_ISSUER`
    ]
  },
  tasks: {
    /**
    * ENV prefix to append to all dynamically set envs durning lookup
    */
    prefix: `GB`,
    /**
    * Contexts to reference durning task execution
    */
    appContexts: [
      [`app`],
      [`dind`, `dnd`, `dd`],
      [`frontend`, `fre`, `fe`],
      [`backend`, `bae`, `be`],
      [`screencast`, `scr`, `sc`],
    ],
  }
}
