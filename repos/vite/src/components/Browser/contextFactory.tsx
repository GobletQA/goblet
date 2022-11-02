import type { ComponentType } from 'react'
import { createContext, useContext } from 'react'

export type TContextFactory<T> = {
  Consumer: React.Consumer<T>
  Provider: any
  useContext: () => T
}

export const contextFactory = <T,>(
  useContextState: () => T,
  ContextComponent?: ComponentType
):TContextFactory<T> => {
  const Context = createContext<T>({} as T)


  const ProcessProvider = ({ children }:any) => (
    <Context.Provider value={useContextState()}>
      {children}
      {ContextComponent ? <ContextComponent /> : <></>}
    </Context.Provider>
  )

  return {
    Provider: ProcessProvider,
    Consumer: Context.Consumer,
    useContext: () => useContext(Context),
  }
}


