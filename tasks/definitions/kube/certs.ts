import path from 'path'
import { uuid } from'@keg-hub/jsutils'
import { writeFileSync, rmSync } from 'fs'
import { helm } from '../../utils/helm/helm'
import { tempDir, scriptsDir } from'../../paths'
import { Logger, error } from'@keg-hub/cli-utils'
import { loadEnvs } from '../../utils/envs/loadEnvs'
import { kubectl } from '../../utils/kubectl/kubectl'

/**
 * Creates a kubernetes job using the goblet-certs helm chart
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
  // const envs = loadEnvs({ env: params.env, force: true, override: true })

  console.log(`Not yes implemented`)
  process.exit(0)
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
      example: `--name goblet-certs`,
      description: `Name to give to the goblet-certs job within the cluster`,
    },
    chart: {
      alias: [`crt`],
      example: `--chart /path/to/cert-manager.yaml`,
      env: `GB_CR_CHART_URL`,
      default: `oci://ghcr.io/gobletqa/goblet-certs-chart`,
      description: `Path or URI to a helm chart to use. Defaults to goblet-charts`,
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
