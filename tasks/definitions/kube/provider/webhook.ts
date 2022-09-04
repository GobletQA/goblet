import { Logger } from'@keg-hub/cli-utils'
import { helm } from '../../../utils/helm/helm'
import { loadEnvs } from '../../../utils/envs/loadEnvs'
import { kubectl } from '../../../utils/kubectl/kubectl'

/**
 * Builds, cleans, and ensures the correct params exist in the correct format
 */
const buildCertParams = (params:Record<any, any>, envs:Record<any, any>) => {
  const { GB_CM_NAMESPACE=`cert-manager` } = envs
  const { env, name=env, certNamespace=GB_CM_NAMESPACE } = params

  return {
    name,
    certNamespace,
    skipParams: {...params, name, skipNs: true, skipContext: true },
  }
}

/**
 * Installs a cloud provider webhook via helm for auth with cert-manager
 * @example
 * `helm install cert-manager-webhook-linode --namespace cert-manager https://github.com/slicen/cert-manager-webhook-linode/releases/download/v0.2.0/cert-manager-webhook-linode-v0.2.0.tgz`
 */
const installProviderWebhook = async ({
  envs,
  params,
  certNamespace,
}:Record<any, any>) => {
  const wbName = params.webhookName || envs.GB_CM_WEBHOOK_CHART_NAME
  const wbUrl = params.webhookUrl || envs.GB_CM_WEBHOOK_CHART_URL
  if(!wbName || !wbUrl) return

  params.log && Logger.success(`Installing provider cert-manager webhook...\n`)

  return await helm.install([wbName, `--namespace`, certNamespace, wbUrl], params)
}


const whAction = async (args:Record<any, any>) => {
  const { clean, remove, ...params } = args.params
  const envs = loadEnvs({ env: params.env, force: true, override: true })
  const { certNamespace, skipParams } = buildCertParams(params, envs)

  await kubectl.ensureContext(params)

  return await installProviderWebhook({
    envs,
    certNamespace,
    params: skipParams,
  })
}


export const webhook = {
  name: 'webhook',
  action: whAction,
  alias: [ `wbh`, `wh`],
  options: {
    context: {
      alias: [`kube-context`, `kc`, `ctx`],
      example: `--context my-context`,
      env: `GB_KUBE_CONTEXT`,
      description: `Kubernetes context to use when creating the secret`,
    },
    namespace: {
      alias: [`nsp`, `ns`],
      example: `--namespace custom-namespace`,
      description: `Custom namespace to use`,
    },
    certNamespace: {
      alias: [`cns`, `cnsp`],
      example: `--certNamespace custom-cert-namespace`,
      description: `Custom namespace to use for the cert-manager`,
    },
    clean: {
      alias: [`cl`],
      type: `boolean`,
      description: `Remove the deploy helm release before installing`,
    },
    remove: {
      alias: [`rm`],
      type: `boolean`,
      description: `Only cleanup deployed resources. Do not redeploy`,
    },
    webhookName: {
      alias: [`wbn`, `wbname`],
      description: `Name of the webhook chart to install`,
    },
    webhookUrl: {
      alias: [`wbu`, `wburl`],
      description: `Url of the webhook chart to install`,
    },
    log: {
      default: true,
      type: `boolean`,
      description: `Log the commands to be run`,
    },
  }
}
