import type { Docker } from '../docker'
import type { ContainerCreateOptions } from 'dockerode'
import type {
  TRunOpts,
  TPortsMap,
  TImgConfig,
  TPublicUrls,
  TCreatePortsObj,
} from '@gobletqa/shared/types'

import { buildLabels } from './buildLabels'
import { buildContainerEnvs } from './buildEnvs'
import { buildImgUri } from '../image/buildImgUri'

export type TCreateContResp = {
  ports: TPortsMap
  config: ContainerCreateOptions
}

export const containerConfig = async (
  docker:Docker,
  image:TImgConfig,
  userHash:string,
  runOpts:TRunOpts,
  portData:TCreatePortsObj,
  urls: TPublicUrls
):Promise<ContainerCreateOptions> => {

  const { ports, exposed, bindings } = portData

  return {
    // TODO: figure out the best way to name the containers to avoid collisions
    // Doing it this way will fail if the user tries to create more then one image of the same type
    // name: userHash,
    ...runOpts,
    ExposedPorts: exposed,
    Image: buildImgUri(image),
    Labels: buildLabels(image, userHash),
    Env: buildContainerEnvs(image, {
      urls,
      ports,
      userHash,
    }, {}),
    HostConfig: {
      ...runOpts.hostConfig,
      IpcMode: `private`,
      PortBindings: bindings,
      PidsLimit: image?.pidsLimit || docker?.config?.pidsLimit,

      // TODO: Investigate auto-remove with RestartPolicy - can't have both?
      AutoRemove: true,
      // RestartPolicy: {
      //   Name: image?.container?.restartPolicy,
      //   MaximumRetryCount: image?.container?.retryCount,
      // },
      // Explicitly set Privileged to ensure it can't be overwritten
      Privileged: false,
      // TODO: investigate containe StorageOpt, this
      // StorageOpt: { size: `10G`},
    }
  }
}
