import path from 'path'
import { uuid } from'@keg-hub/jsutils'
import { writeFileSync, rmSync } from 'fs'
import { helm } from '../../utils/helm/helm'
import { tempDir, scriptsDir } from'../../paths'
import { Logger, error } from'@keg-hub/cli-utils'
import { loadEnvs } from '../../utils/envs/loadEnvs'
import { kubectl } from '../../utils/kubectl/kubectl'


const saveTempFile = (value:string) => {
  const tempFileLoc = path.join(tempDir, `${uuid()}.yaml`)
  writeFileSync(tempFileLoc, value)

  return tempFileLoc
}

/**
 * Urls for interacting with letsencrypt and creating certs
 * Keys represent
 */
const urls = {
  production: `https://acme-v02.api.letsencrypt.org/directory`,
  staging: `https://acme-staging-v02.api.letsencrypt.org/directory`,
}

/**
 * Generates a config file for a ClusterIssuer resource
 * Requires cert-manager be installed
 */
const getClusterIssuer = ({ env, name, email }:Record<any, any>) => `
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-${name}
spec:
  acme:
    email: ${email}
    server: ${urls[env] || urls.staging}
    privateKeySecretRef:
      name: letsencrypt-${name}-secret
    solvers:
    - http01:
        ingress:
          class: nginx
`

const buildIssuer = async (params:Record<any, any>) => {
  const { env, name=env } = params
  const { getDockerUser } = await import(path.join(scriptsDir, 'js/dockerLogin.js'))
  
  // Get the user name in the same way docker and devspace do
  const envs = loadEnvs({ env, force: true, override: true })
  const email =  params.email || await getDockerUser(envs)
  const content = getClusterIssuer({ ...params, email, name })

  return saveTempFile(content)
}

const cleanUp = async (params:Record<any, any>, certNamespace:string) => {
  await helm.delete([certNamespace, `--namespace`, certNamespace], params)

  !params.issuerLoc
    ? await kubectl.delete([`clusterissuers.cert-manager.io`, certNamespace], params)
    : Logger.log(
        Logger.colors.yellow(`Skipping clean up of issuer.\n`),
        Logger.colors.white(`Custom issuer location options was passed`)
      )

  await kubectl.delete([`namespace`, certNamespace], params)
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
 * @example
 *
 */
const certAct = async (args:Record<any, any>) => {
  const { clean, remove, ...params } = args.params
  const { env, name=env, log } = params
  const skipParams = {...params, skipNs: true, skipContext: true}
  
  const certNamespace = `${params.certNamespace}-${name}`
  const version = params.version.startsWith(`v`) ? params.version : `v${params.version}`
  const certLoc = params.certLoc || `https://github.com/cert-manager/cert-manager/releases/download/${version}/cert-manager.crds.yaml`

  await kubectl.ensureContext(params)
  ;(clean || remove) && await cleanUp(skipParams, certNamespace)

  if(remove)
    return log ? Logger.success(`Successfully removed Cert-Manager resources\n`) : undefined

  log && Logger.pair(`Applying cert-manager from location`, certLoc)
  await kubectl.apply([`-f`, certLoc], params)

  log && Logger.pair(`Creating cert-manager namespace`, certNamespace)
  await kubectl.create([`namespace`, certNamespace], params)

  await helm.repo.add([`jetstack`, `https://charts.jetstack.io`], params)
  await helm.repo.update([], params)

  log && Logger.pair(`Installing cert-manager`, certNamespace)

  await helm.install(
    [
      certNamespace,
      `--namespace`,
      certNamespace,
      `--version`,
      version,
      `jetstack/cert-manager`,
    ],
    {...skipParams, throwErr: true}
  )

  const issuerLoc = params.issuerLoc || await buildIssuer(params)

  try {
    log  && Logger.pair(`Creating kubernetes issuer`, issuerLoc)
    await kubectl.create([`-f`, issuerLoc], { ...params, throwErr: true })
  }
  catch(err){
    rmSync(issuerLoc)
    error.throwError(err)
  }

  log && Logger.success(`Successfully deployed Cert-Manager`)

}

export const cert = {
  name: 'cert',
  action: certAct,
  alias: [ `ing`, `in`],
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
      default: `cert-manager`,
      example: `--certNamespace custom-cert-namespace`,
      description: `Custom namespace to use for the cert-manager`,
    },
    certLoc: {
      alias: [`cl`],
      example: `--certLoc /path/to/cert-manager.yaml`,
      description: `Path or URI to a kubernetes resource definition of the cert-manager`,
    },
    issuerLoc: {
      alias: [`il`],
      example: `--issuerLoc /path/to/issuer.yaml`,
      description: `Path or URI to a kubernetes resource definition of the Issuer or ClusterIssuer`,
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
      type: `boolean`,
      description: `Log the commands to be run`,
    },
  }
}
