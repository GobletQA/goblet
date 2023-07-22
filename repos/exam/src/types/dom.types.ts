
export type TDomScripts = {
  mouseTracking:string
  [key:string]:string
}

export type TDomScriptOptions = {
  scripts?:Record<string, ()=>any>
}
