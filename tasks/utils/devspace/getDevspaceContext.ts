import { noOpObj } from '@keg-hub/jsutils'
import { loadEnvs } from '../envs/loadEnvs'
import { error } from '@keg-hub/cli-utils'

type TParams = {
  env?: string
  force?: boolean
  override?: boolean
  namespace?: string
  kubeContext?: string
  [key:string]: any
}

type TDSArr = string[]
type TDSObj = {
  context?: string
  namespace?: string
}
type TDSContext = TDSArr & TDSObj


/**
 * Runs devspace use command passing in the configured namespace and kube-context
 */
export const getDevspaceContext = (
  params:TParams = noOpObj as TParams,
  throwErr:boolean=true
) => {
  const { namespace, kubeContext, env, force, override } = params

  const { GB_KUBE_NAMESPACE = `gb-local`, GB_KUBE_CONTEXT } = loadEnvs({ env, force, override })

  const { GB_KUBE_NAMESPACE:ENV_GB_KUBE_NAMESPACE, GB_KUBE_CONTEXT:ENV_GB_KUBE_CONTEXT } = process.env

  throwErr &&
  !kubeContext &&
  !GB_KUBE_CONTEXT &&
  !ENV_GB_KUBE_CONTEXT &&
    error.throwError(`The "GB_KUBE_CONTEXT" is required to run devspace commands`)

  const ctx = kubeContext || ENV_GB_KUBE_CONTEXT || GB_KUBE_CONTEXT
  const ns = namespace || ENV_GB_KUBE_NAMESPACE || GB_KUBE_NAMESPACE

  const arrayCtx:TDSContext = [`--namespace`, ns, `--kube-context`, ctx]

  // A bit of a heck, but allows accessing the namespace and context in either an array or object
  arrayCtx.namespace = ns
  arrayCtx.context = ctx

  return arrayCtx
}
