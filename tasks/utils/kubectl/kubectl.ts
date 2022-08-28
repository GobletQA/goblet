import { loadEnvs } from '../envs/loadEnvs'
import { command } from '../process/command'
import { error, Logger } from '@keg-hub/cli-utils'
import { getDeployContext } from '../helpers/contexts'
import { noOpObj, noPropArr, parseJSON } from '@keg-hub/jsutils'

type TTaskParams = {
  log?: boolean
  exec?: boolean
  context?: string
  [key:string]: any
}

type TCallback<T> = (args?:string|string[]|TTaskParams, params?:TTaskParams) => Promise<T>

type TKubeCtl = {
  (cmd:string|string[], params:TTaskParams, validExitCode?:string|number[]): Promise<string>
  create: TCallback<string>
  useContext: TCallback<string>
  getContexts: TCallback<string[]>
  ensureContext: TCallback<string>
  currentContext: TCallback<string>
  getPod: TCallback<Record<any, any>>
  getPods: TCallback<Record<any, any>>
}

/**
 * Wrapper method to resolve the args passed to the kube methods
 */
const resolveArgs = <T>(callback:TCallback<T>) => {
  return async (
    args?:string|string[]|TTaskParams,
    params?:TTaskParams
  ) => {
    const argsArr = Array.isArray(args)
    const argsStr = typeof args === `string`
    
    const kArgs = argsArr ? args : argsStr ? args.split(` `) : noPropArr

    const kParams = argsStr || argsArr
      ? params || noOpObj as TTaskParams
      : args || noOpObj as TTaskParams

    return await callback(kArgs, kParams)
  }
}

/**
 * Runs a kubectl command and returns the output
 * Exits the process if the devspace command throws an error
 * @function
 * @public
 * @param {string|Array<string>} cmd - kubectl command to run split as an array
 * @param {Object} params - Passed in task options, converted into an object
 *
 * @returns {Void}
 */
export const kubectl = command(`kubectl`) as TKubeCtl

/**
 * Creates a kubernetes object from the passed in args 
 */
kubectl.create = resolveArgs<string>(async (
  args:string|string[],
  params?:TTaskParams,
) => {
  await kubectl.ensureContext(args, params)
  return await kubectl([`create`, ...args], {exec: true, ...params})
})

/**
 * Gets the current kube-context
 */
kubectl.currentContext = resolveArgs<string>(async (
  args?:string|string[],
  params?:TTaskParams,
) => {
  const output = await kubectl([`config`, `current-context`, ...args], {exec: true, ...params})
  return output.trim()
})

/**
 * Gets all available contexts
 */
kubectl.getContexts = resolveArgs<string[]>(async (
  args?:string|string[],
  params?:TTaskParams,
) => {
  const output = await kubectl([`config`, `get-contexts`, ...args], {exec: true, ...params})
  return output.split(`\n`).map(ctx => ctx.trim())
})

/**
 * Sets the current kube-context to the passed in value
 */
kubectl.useContext = resolveArgs<string>(async (
  args?:string|string[],
  params?:TTaskParams,
) => {
  const resp = await kubectl([`config`, `use-context`, ...args], {exec: true, ...params})
  params.log && Logger.log(resp)

  return await kubectl.currentContext(params)
})

/**
 * Sets the current kube-context to the passed in value
 */
kubectl.ensureContext = resolveArgs<string>(async (
  args?:string|string[],
  params?:TTaskParams,
) => {
  const { context, env, log } = params
  const { GB_KUBE_CONTEXT } = loadEnvs({ env })

  const curContext = await kubectl.currentContext()
  const kubeContext = params.kubeContext || context || process.env.GB_KUBE_CONTEXT || GB_KUBE_CONTEXT || ``
  const switchContexts = kubeContext && curContext !== kubeContext.trim()

  if(log)
    switchContexts
      ? Logger.pair(`Using context ${kubeContext}`)
      : Logger.pair(`Using context ${curContext}`)

  return kubeContext && curContext !== kubeContext.trim()
    ? await kubectl.useContext(kubeContext)
    : curContext
})


/**
 * Gets the details for all pods as a JSON object
 */
kubectl.getPods = resolveArgs<Record<any, any>>(async (
  args?:string|string[],
  params?:TTaskParams,
) => {
  await kubectl.ensureContext(args, params)
  const output = await kubectl([`get`, `pods`, `-o`, `json`, ...args], { ...params, exec: true })
  return parseJSON(output, false)
})

/**
 * Gets the details for a single pod as a JSON object
 */
kubectl.getPod = resolveArgs<Record<any, any>>(async (
  args?:string|string[],
  params?:TTaskParams,
) => {

  // Context is used differently here, so we extract it for the call to getPods
  const { context, ...altParams } = params
  !context && error.throwError(`The context param is required to find a pod`)

  const match = getDeployContext(context, params.env)

  !match &&
    error.throwError(`Can not match a pod to non-existing match argument ${context}`)

  const { items } = await kubectl.getPods(args, altParams)

  return items?.find((item:Record<any, any>) =>
    Object.values(item?.metadata?.labels)
      .map((val) => (val as string).toLowerCase().trim())
      .includes(match.toLowerCase().trim())
  )
})


// TODO: Add method to set the default namespace
// kubectl config set-context --current --namespace=gb-production