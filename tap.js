require('./configs/aliases.config').registerAliases()
// TODO: figure out how to make this an alias instead of relative path
const { getGobletConfig } = require('./repos/shared/src/utils/getGobletConfig')
const { loadEnvs } = require('./repos/shared/src/utils/loadEnvs')

const nodeEnv = process.env.NODE_ENV || `local`
loadEnvs({
  force: true,
  locations: [],
  name: `goblet`,
  override: nodeEnv === 'local'
})

const config = getGobletConfig()
const { serviceAccount, ...firebaseConfig } = config.firebase
const {
  NODE_ENV,
  GB_BE_PORT,
  GB_SC_PORT,
  GB_BE_HOST,
  GB_VNC_ACTIVE,
  GB_NO_VNC_PATH,
  GB_BE_WS_PATH,
  GB_PW_SOCKET_ACTIVE,
  GB_GITHUB_AUTH_USERS,
  GB_VNC_VIEW_WIDTH=1440,
  GB_VNC_VIEW_HEIGHT=900,
} = process.env

const wsServerConfig = {
  port: GB_BE_PORT,
  path: GB_BE_WS_PATH,
}

module.exports = {
  alias: 'goblet',
  name: 'goblet',
  displayName: 'Goblet',
  keg: {
    envs: {
      'process.env.NODE_ENV': NODE_ENV,
      'process.env.GB_BE_HOST': GB_BE_HOST,
      'process.env.GB_BE_PORT': GB_BE_PORT,
      'process.env.GB_SC_PORT': GB_SC_PORT,
      'process.env.GB_VNC_ACTIVE': GB_VNC_ACTIVE,
      'process.env.GB_NO_VNC_PATH': GB_NO_VNC_PATH,
      'process.env.GB_PW_SOCKET_ACTIVE': GB_PW_SOCKET_ACTIVE,
      'process.env.GB_GITHUB_AUTH_USERS': GB_GITHUB_AUTH_USERS,
      'process.env.GB_VNC_VIEW_WIDTH': `${GB_VNC_VIEW_WIDTH}`,
      'process.env.GB_VNC_VIEW_HEIGHT': `${GB_VNC_VIEW_HEIGHT}`,
      'process.env.WS_SERVER_CONFIG': JSON.stringify(wsServerConfig),
      ...(firebaseConfig.ui && {
        'process.env.FIRE_BASE_CONFIG': JSON.stringify(firebaseConfig),
      }),
    },
    cli: {
      paths: {
        container: `./container`,
        repos: `./repos`,
      }
    },
    routes: {
      '/': 'RootContainer',
      '/editor': 'EditorScreen',
      '/screencast': 'ScreencastScreen',
      '/results': 'ResultsScreen',
    },
    tapResolver: {
      paths: {
        tapSrc: './repos/frontend/src',
      },
      aliases: {
        nameSpace: "HK",
        dynamic: {
          // Path is relative to <tap-root>/node_modules/keg-core/core/base
          // So we have to go-back 4 dirs to get back to tap-root, and find the admin repo
          GSHModels: '../../../../repos/shared/src/models',
          GSHUtils: '../../../../repos/shared/src/utils/frontend',
        },
      },
    },
  },
  expo: {
    name: 'goblet',
    slug: 'goblet',
    platforms: ['web'],
  },
}
