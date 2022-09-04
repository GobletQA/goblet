import path from 'path'
import { uuid } from'@keg-hub/jsutils'
import { writeFileSync, rmSync } from 'fs'
import { helm } from '../../utils/helm/helm'
import { tempDir, scriptsDir } from'../../paths'
import { Logger, error } from'@keg-hub/cli-utils'
import { loadEnvs } from '../../utils/envs/loadEnvs'
import { kubectl } from '../../utils/kubectl/kubectl'
import { getClusterIssuer } from '../../utils/kubectl/getClusterIssuer'
import {
  CERT_REPO_URL,
  CERT_CHART_URL,
  CERT_CHART_NAME,
} from '../../constants/kube'

/**
 * Saves a file to temp storage
 */
const saveTempFile = (value:string) => {
  const tempFileLoc = path.join(tempDir, `${uuid()}.yaml`)
  writeFileSync(tempFileLoc, value)

  return tempFileLoc
}

const getPrefixedName = (prefix:string, name:string) => `${prefix}-${name}`


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

/**
 * Builds, cleans, and ensures the correct params exist in the correct format
 */
const buildCertParams = (params:Record<any, any>, envs:Record<any, any>) => {
  const {
    GB_CM_VERSION,
    GB_CM_REPO_URL=CERT_REPO_URL,
    GB_CM_NAMESPACE=`cert-manager`
  } = envs
  
  const { env, name=env, certNamespace=GB_CM_NAMESPACE } = params
  let version = params.version || GB_CM_VERSION
  version = version.startsWith(`v`) ? version : `v${version}`

  return {
    name,
    version,
    certNamespace,
    skipParams: {...params, name, skipNs: true, skipContext: true},
    certLoc: params.certLoc || GB_CM_REPO_URL.replace(`{{version}}`, version),
  }
}

/**
 * Gets the required data needed, and generates a cluster-issuer template file
 * Then saves the generated template to a temp file
 */
const buildIssuerTemplate = async ({
  name,
  envs,
  params,
}:Record<any, any>) => {
  const { env, solverType } = params
  const { getDockerUser } = await import(path.join(scriptsDir, 'js/dockerLogin.js'))
  const email =  params.email || envs.GB_CM_USER_EMAIL || await getDockerUser(envs)

  const content = getClusterIssuer({
    env,
    email,
    prefixName: getPrefixedName(`letsencrypt`, name),
    groupName: params.groupName || envs.GB_CM_GROUP_NAME,
    solverName: params.solverName || envs.GB_CM_SOLVER_NAME,
  }, solverType)

  return saveTempFile(content)
}

/**
 * Installs the cert-manager use kubectl and helm
 * @example
 * `kubectl apply -f <path-to-cert-manager.yaml>`
 * `kubectl create namespace cert-manager-prod`
 * `helm repo add jetstack https://charts.jetstack.io`
 * `helm repo update`
 * `helm install cert-manager-prod --namespace cert-manager-prod --version 1.8.0 jetstack/cert-manager`
 */
const installCertManager = async ({
  skip,
  name,
  params,
  certLoc,
  version,
  skipParams,
  certNamespace,
}:Record<any, any>) => {
  
  params.log && Logger.pair(`Applying cert-manager from location`, certLoc)
  await kubectl.apply([`-f`, certLoc], params)

  await helm.repo.add([CERT_CHART_NAME, CERT_CHART_URL], params)
  await helm.repo.update([], params)

  params.log && Logger.pair(`Installing cert-manager`, certNamespace)

  return await helm.install(
    [
      getPrefixedName(certNamespace, name),
      `--namespace`,
      certNamespace,
      `--version`,
      version,
      `${CERT_CHART_NAME}/cert-manager`,
    ],
    {...skipParams, throwErr: true}
  )
}

/**
 * Creates the namespace for the cert-manager
 */
const createCertManagerNs = async ({
  params,
  certNamespace
}) => {
  params.log && Logger.pair(`Creating cert-manager namespace`, certNamespace)
  return await kubectl.create([`namespace`, certNamespace], params)
}

/**
 * Creates the cluster-issuer resource from passed in file or generated template
 * If a template is generated, it is remove after it is kubectl create command finishes running
 * @example
 * `kubectl create -f <path/to/resource/definition.yaml>`
 */
const createIssuerResource = async ({
  name,
  envs,
  params
}) => {
  const { log } = params
  const issuerLoc = params.issuerLoc || await buildIssuerTemplate({ name, envs, params })
  let createErr:Error

  try {
    log  && Logger.pair(`Creating kubernetes issuer`, issuerLoc)
    await kubectl.create([`-f`, issuerLoc], { ...params, throwErr: true })
  }
  catch(err){
    createErr = err
  }
  finally {
    !params.issuerLoc && rmSync(issuerLoc)
    createErr && error.throwError(createErr)
  }
}

/**
 * Removes the cert-manager using the kubectl and helm delete commands
 * @example
 * `helm delete cert-manager-prod --namespace cert-manager-prod`
 * `kubectl delete clusterissuers.cert-manager.io letsencrypt-prod`
 * `helm delete namespace cert-manager-prod`
 */
const cleanUp = async ({
  skip,
  name,
  envs,
  params,
  certNamespace
}:Record<any, any>) => {
  const { issuerLoc } = params

  !(skip.find((item:string) => item.startsWith(`c`)))
    && await helm.delete([getPrefixedName(certNamespace, name), `--namespace`, certNamespace], params)

  if(!(skip.find((item:string) => item.startsWith(`i`))))
    !issuerLoc
      ? await kubectl.delete([`clusterissuers.cert-manager.io`, getPrefixedName(`letsencrypt`, name)], params)
      : Logger.log(
          Logger.colors.yellow(`Skipping clean up of issuer.\n`),
          Logger.colors.white(`Custom issuer location options was passed`)
        )

  !(skip.find((item:string) => item.startsWith(`n`)))
    && await kubectl.delete([`namespace`, certNamespace], params)
}

/**
 * Creates a kubernetes cert-manager resource
 * Does not seem to be supported via devspace.yaml config file
 * Using the `upgrade` command should allow this it to be idempotent
 * The helm executable is required for the command to work properly
 *
 * @param {Object} args - arguments passed from the runTask method
 * @param {string} args.command - Root task name
 * @param {Object} args.tasks - All registered tasks of the CLI
 * @param {string} args.task - Task Definition of the task being run
 * @param {Array} args.options - arguments passed from the command line
 * @param {Object} args.globalConfig - Global config object for the keg-cli
 * @param {Object} args.params - Passed in options, converted into an object
 *
 */
const certAct = async (args:Record<any, any>) => {
  const { clean, remove, skip, ...params } = args.params
  const envs = loadEnvs({ env: params.env, force: true, override: true })
  
  const {
    name,
    certLoc,
    version,
    skipParams,
    certNamespace
  } = buildCertParams(params, envs)

  await kubectl.ensureContext(params)

  ;(clean || remove) && await cleanUp({ params: skipParams, skip, envs, name, certNamespace })
  if(remove)
    return params.log ? Logger.success(`Successfully removed Cert-Manager resources\n`) : undefined

  !(skip.find((item:string) => item.startsWith(`n`)))
    && await createCertManagerNs({params, certNamespace})

  !(skip.find((item:string) => item.startsWith(`c`))) &&
    await installCertManager({
      skip,
      name,
      params,
      version,
      certLoc,
      skipParams,
      certNamespace,
    })

  !(skip.find((item:string) => item.startsWith(`i`))) &&
    await createIssuerResource({name, envs, params})

  params.log && Logger.success(`Successfully deployed Cert-Manager`)
}

export const certs = {
  name: `certs`,
  action: certAct,
  alias: [ `cert-manager`, `cert`, `cm`],
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
    version: {
      alias: [`ver`],
      default: `1.9.1`,
      example: `--version 1.9.1`,
      description: `Set the version of the cert-manager to use`,
    },
    name: {
      alias: [`nm`],
      example: `--name my-cert-manager`,
      description: `Name of the cert-manager`,
    },
    certNamespace: {
      alias: [`cns`, `cnsp`],
      example: `--certNamespace custom-cert-namespace`,
      description: `Custom namespace to use for the cert-manager`,
    },
    certLoc: {
      alias: [`crl`],
      example: `--certLoc /path/to/cert-manager.yaml`,
      description: `Path or URI to a kubernetes resource definition of the cert-manager`,
    },
    skip: {
      type: `array`,
      alias: [`skp`, `sk`],
      example: `--skip issuer,provider`,
      description: `Define parts of the certs deploy process to skip`,
    },
    issuerLoc: {
      alias: [`il`],
      example: `--issuerLoc /path/to/issuer.yaml`,
      description: `Path or URI to a kubernetes resource definition of the Issuer or ClusterIssuer`,
    },
    solverType: {
      alias: [`slt`, `st`],
      default: `webhook`,
      example: `--solverType http`,
      description: `Type of ACME issuer to use. Must be 'http', 'dns' or 'webhook'`,
    },
    solverName: {
      alias: [`sln`, `sn`],
      example: `--solverName linode`,
      description: `Name used for the solverName property in the dns01 webhook solver`,
    },
    groupName: {
      alias: [`sln`, `sn`],
      example: `--groupName acme.slicen.me`,
      description: `Name used for the groupName property in the dns01 webhook solver`,
    },
    email: {
      alias: [`eml`],
      example: `--email my@email.com`,
      description: `Email address to use for cert validation`,
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
    log: {
      default: true,
      type: `boolean`,
      description: `Log the commands to be run`,
    },
  }
}
