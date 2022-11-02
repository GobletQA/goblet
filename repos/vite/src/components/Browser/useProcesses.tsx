import { useCallback, useState } from "react"
import { contextFactory } from './contextFactory'

export type TSize = NonNullable<{ height: any, width: any }>

export type ComponentProcessProps = {
  id: string;
}

export type TProcess = {
  icon?: string
  Component?: React.ComponentType<ComponentProcessProps>
  closing?: boolean
  defaultSize?: TSize
  hasWindow?: boolean
  maximized?: boolean
  minimized?: boolean
  singleton?: boolean
  title?: string
  url?: string
}
export type TProcesses = Record<string, TProcess>

export type TProcessContextState = {
  processes: TProcesses
  url: (newUrl: string) => void
}

const setProcessSettings = (processId: string, settings: Partial<TProcess>) => {
  return (currentProcesses: TProcesses): TProcesses => {
    const { ...newProcesses } = currentProcesses;

    if (newProcesses[processId]) {
      newProcesses[processId] = {
        ...newProcesses[processId],
        ...settings,
      };
    }

    return newProcesses
  }
}

export const setUrl = (url: string) => {
  return (currentProcesses: TProcesses): TProcesses => {
    return setProcessSettings(`goblet-browser`, { url })(currentProcesses)
  }
}

export const setIcon = (processId: string, icon: string) => {
  return (currentProcesses: TProcesses): TProcesses => {
    return setProcessSettings(processId, { icon })(currentProcesses)
  }
}

export const useProcessContextState = () => {
  const [processes, setProcesses] = useState<TProcesses>(Object.create(null) as TProcesses)

  const url = useCallback(
    (newUrl: string) => setProcesses(setUrl(newUrl)),
    []
  )

  return {
    url,
    processes
  }
}

const { Consumer, Provider, useContext } = contextFactory<TProcessContextState>(
  useProcessContextState
)

export {
  Consumer as ProcessConsumer,
  Provider as ProcessProvider,
  useContext as useProcesses,
}
