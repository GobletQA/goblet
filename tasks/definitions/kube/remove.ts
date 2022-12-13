import type { TTaskActionArgs, TTaskParams } from '../../types'
import { Logger } from '@keg-hub/cli-utils'
import { omitKeys } from '@keg-hub/jsutils'
import { kubectl } from '../../utils/kubectl/kubectl'
import { getLongContext } from '../../utils/helpers/contexts'

/**
 * Finds any existing pods matching the passed in context
 * Converts the context to a long-context allowing context aliases
 */
const findPods = async (params:TTaskParams) => {
  const {
    context,
    label,
    name,
    exact,
    log
  } = params

  log && Logger.pair(`Finding pods matching context`, context)

  const lgCtx = getLongContext(context, context)
  const pods = await kubectl.getPods()
  return pods.items.filter(pod => {
    if(name){
      const found = exact
        ? pod?.metadata?.name === lgCtx
        : pod?.metadata?.name.includes(lgCtx)

      if(found) return true
    }

    return !label
      ? false
      : Boolean(
          Object.values(pod?.metadata?.labels).find((lb:string) => exact ? lb === lgCtx : lb.includes(lgCtx))
        )
  }) as Record<any, any>[]
}

const removeAction = async (args:TTaskActionArgs) => {
  const { params } = args
  const pods = await findPods(params)
  if(!pods.length)
    return params.log
      && Logger.warn(`Could not find pod(s) matching context ${params.context}`)

  params.log && Logger.highlight(`Found`, pods.length, `matching pod(s), removing...`)

  const proms = await Promise.all(
    pods.map(async (pod) => {
      return pod?.metadata?.name
        && await kubectl.delete.pod([pod?.metadata?.name], omitKeys(params, [`context`]))
    })
  )

  params.log
    && Logger.success(`Successfully removed pods\n${Logger.colors.white(`  ` + proms.join(`  `))}`)

  return true
}

export const remove = {
  name: `remove`,
  action: removeAction,
  alias: [`rm`, `delete`],
  description: `Delete a kubernetes pod`,
  options: {
    context: {
      alias: [ `ctx`],
      example: `--name my-ingress`,
      default: `ingress-nginx`,
      description: `Name or context of the pod to remove`,
    },
    label: {
      alias: [`lb`],
      default: true,
      example: `--label`,
      description: `Search labels for a matching pod`
    },
    name: {
      alias: [`nm`],
      default: true,
      example: `--no-name`,
      description: `Search name for a matching pod`
    },
    exact: {
      alias: [`ex`],
      default: false,
      example: `--exact`,
      description: `Context must match pod meta-data exactly`
    },
    log: {
      alias: [`lg`],
      default: true,
      example: `--no-log`,
      description: `Verbose logging of task actions`
    }
  }
}