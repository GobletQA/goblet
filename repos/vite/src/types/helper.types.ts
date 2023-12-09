export type TAnyCB = (...args:any[]) => any

export type TAbortError = Error & {
  canceled:boolean
}


export enum EOSType {
  ios=`ios`,
  lin=`linux`,
  mac=`macos`,
  win=`windows`,
  and=`android`,
  unknown=`unknown`
}
