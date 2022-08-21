import type { Docker } from '../docker'
import type { ContainerCreateOptions } from 'dockerode'
import {
  TRunOpts,
  TPortsMap,
  TImgConfig,
  TPublicUrls,
  TCreatePortsObj,
} from '@gobletqa/conductor/types'

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

    // TODO: investigate createContainer options that should be allowed form a request
    ...runOpts,
    ExposedPorts: exposed,
    Image: buildImgUri(image),
    Labels: buildLabels(image, userHash),
    Env: buildContainerEnvs(image, {
        urls,
        ports,
        userHash,
        // options:runOpts,
        // config: docker.config,
        // conductor: docker.conductor,
    }, {
      // TODO: configure this to use the correct userHash
      // VIRTUAL_HOST: `userHash.virtualhost.com`
      // Define which port will be exposed, need to expose more then one port?
      // VIRTUAL_PORT: exposed port
    }),
    HostConfig: {
      ...runOpts.hostConfig,
      IpcMode: `private`,
      // IpcMode: `host`,
      // NetworkMode: 'host',
      PortBindings: bindings,
      PidsLimit: image?.pidsLimit || docker?.config?.pidsLimit,
      RestartPolicy: { Name: `on-failure`, MaximumRetryCount: 2 },
      // Privileged: true
      // Devices: [{
      //   PathOnHost: `/dev/fuse`,
      //   CgroupPermissions: `rwm`,
      //   PathInContainer: `/dev/fuse`,
      // }],
      // CapAdd: [`SYS_ADMIN`],
      // --cap-add SYS_ADMIN --device /dev/fuse
      // TODO: investigate this
      // IpcMode: 'none',
      // AutoRemove: true,
      // StorageOpt: { size: `10G`},
    }
  }
}