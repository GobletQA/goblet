import type { TPodContainer } from '../../../types'
import type { V1Container } from '@kubernetes/client-node'

import { addIfExists } from './helpers'
import { buildPorts } from './buildPorts'
import { EImgPullPolicy } from '../../../types'
import { buildEnvs, buildEnvsFrom } from './buildEnvs'

export const buildContainers = (
  opts:Record<'containers', Record<string, TPodContainer>>
): V1Container[] => {
  return Object.entries(opts?.containers)
    .map(([name, container]:[string, TPodContainer]) => {
      const built:V1Container = {
        name: container.name || name, // must be specified as a DNS_LABEL
        image: container.image,
        env: buildEnvs(container, opts),
        ports: buildPorts(container, opts),
        envFrom: buildEnvsFrom(container, opts),
        imagePullPolicy: container.imagePullPolicy || container.pullPolicy || EImgPullPolicy.Always,
      }

      addIfExists(built, `tty`, container.tty)
      addIfExists(built, `args`, container.args)
      addIfExists(built, `stdin`, container.stdin)
      addIfExists(built, `command`, container.command || container.cmd)
      addIfExists(built, `workingDir`, container.workingDir || container.workdir)

      // --- TODO: investigate this
      addIfExists(built, `resources`, container.resources)
      addIfExists(built, `securityContext`, container.securityContext)

      return built
    })
}