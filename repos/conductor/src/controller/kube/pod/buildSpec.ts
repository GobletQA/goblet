import type { V1PodSpec } from '@kubernetes/client-node'
import type { TPodSpecOpts } from '@gobletqa/shared/types'

import { addIfExists } from './helpers'
import { buildContainers } from './buildContainers'


export const buildSpec = (opts:Record<'spec', TPodSpecOpts>):V1PodSpec => {
  const { spec:specOpts } = opts
  const spec:V1PodSpec = {
    // Disable other service envs being injected into the container
    enableServiceLinks: false,
  // Don't allow containers to see other containers in the POD
    shareProcessNamespace: false,
    // Disable auto mounting the service account token
    automountServiceAccountToken: false,
    containers: buildContainers(specOpts),

    // --- TODO: investigate this
    // securityContext: {}

    // --- TODO: Investigate this - could be helpful
    // Fully qualified Pod hostname will be "<hostname>.<subdomain>.<pod namespace>.svc.<cluster domain>".
    // If not specified, the pod will not have a domainname at all.
    // subdomain: ``,

  // ------ Not needed ------ //
    // activeDeadlineSeconds: 0,
    // affinity: {},
    // dnsConfig: {}
    // dnsPolicy: ``,
    // ephemeralContainers: [],
    // hostAliases: [],
    // hostIPC: false,
    // hostNetwork: false,
    // hostPID: false,
    // hostname: ``,
    // nodeName: ``,
    // nodeSelector: {},
    // os: {},
    // overhead: {},
    // preemptionPolicy: ``,
    // priority: 0,
    // priorityClassName: ``,
    // readinessGates: [],
    // runtimeClassName: ``,
    // schedulerName: ``,
    // setHostnameAsFQDN: false,
    // terminationGracePeriodSeconds: 0,
    // tolerations: [],
    // topologySpreadConstraints: [],
  }
  
  
  addIfExists(spec, `initContainers`, specOpts.initContainers)
  addIfExists(spec, `securityContext`, specOpts.securityContext)
  addIfExists(spec, `volumes`, specOpts.volumes || specOpts.vols)
  addIfExists(spec, `enableServiceLinks`, specOpts.enableServiceLinks)
  addIfExists(spec, `shareProcessNamespace`, specOpts.shareProcessNamespace)
  addIfExists(spec, `restartPolicy`, specOpts.restartPolicy || specOpts.restart)
  addIfExists(spec, `automountServiceAccountToken`, specOpts.automountServiceAccountToken)
  addIfExists(spec, `imagePullSecrets`, specOpts.imagePullSecrets || specOpts.pullSecrets)
  addIfExists(spec, `serviceAccountName`, specOpts.serviceAccountName || specOpts.serviceAccount)  

  return spec
}