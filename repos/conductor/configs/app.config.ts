
import { omitKeys } from '@keg-hub/jsutils'
import { inDocker } from '@keg-hub/cli-utils'
import { TConductorOpts } from '@gobletqa/conductor/types'
import { loadEnvs } from '@gobletqa/shared/utils/loadEnvs'
const nodeEnv = process.env.NODE_ENV || `local`

// TODO: figure out what other envs should be removed
const removeEnvs = [
  `GB_NO_VNC_PORT`,
  `GB_FE_PORT`,
  `GB_BE_PORT`,
  `GB_BE_HOST`,
  `GB_SC_PORT`,
  `GB_SC_HOST`,
  `GB_BE_SOCKET_PORT`,
  `GB_BE_SOCKET_HOST`,
  `GB_VNC_SERVER_PORT`,
  `GB_VNC_SERVER_HOST`,
]

const containerEnvs = inDocker()
  ? omitKeys(process.env, removeEnvs)
  : omitKeys(loadEnvs({
      force: true,
      name: `goblet`,
      locations: [],
      override: nodeEnv === 'local'
    }), removeEnvs)

export const appConfig:TConductorOpts = {
  controller: {
    type: 'Docker'
  },
  images: {
    goblet: {
      tag: `develop`,
      name: `goblet`,
      user: `gobletqa`,
      provider: `ghcr.io`,
      container: {
        mem: 0,
        idle: 5000,
        timeout: 5000,
        rateLimit: 5000,
        ports: [
          7005,
          7006,
          19006,
          26369,
        ],
        envs: {
          ...containerEnvs,
          GB_VNC_ACTIVE: true,
          GB_AUTH_ACTIVE: true,
          KEG_DOCKER_EXEC: `conductor`,
        },
        runtimeEnvs: {
          // TODO: remove these once the frontend image is properly built
          GB_BE_API_HOST: `urls.7005`,
          GB_BE_API_PORT: `ports.7005`,

          GB_BE_HOST: `urls.7005`,
          GB_BE_PORT: `ports.7005`,
          GB_BE_SOCKET_PORT: `ports.7005`,
          GB_NO_VNC_PORT: `ports.26369`,
          GB_FE_PORT: `ports.19006`,
          GB_VNC_SERVER_HOST: `urls.26370`,
          GB_VNC_SERVER_PORT: `ports.26370`,
          GB_SC_HOST: `urls.7006`,
          GB_SC_PORT: `ports.7006`,
          // TODO: this should be dynamically set to the auth users email
          // which is passed in at run time
          // GB_GITHUB_AUTH_USERS: `user.email`,
        }
      }
    }
  }
}
