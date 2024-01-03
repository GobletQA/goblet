// TODO: update this to be generated from the existing types
// Then it can be added to both the mounted repo, and within monaco

declare function expect(...args:any[]):any

declare module '@GEnvironment' {
  export var values = Record<string, string>
  export var secrets = Record<string, string>
}

declare module '@GTU' {}

declare module '@GTU/Types' {
  export type TStepCtx = Record<string, any>
  export type TBrowserPage = Record<string, any>
}

declare module '@GTU/Playwright' {
  export type TPage = Record<string, any>
  export type TLocator = Record<string, any>

  export function getPage(...args:any[]):TPage
  export function getLocator(...args:any[]):TLocator
}

declare module '@GTU/Support/helpers' {
  export function typeInput(...args:any[]):any
  export function clickElement(...args:any[]):any
  export function saveWorldData(...args:any[]):any

  export function cleanWorldPath(worldPath:string, ...args:any[]):any
  export function clearWorldPath(worldPath:string, ...args:any[]):any

  export function getWorldData(...args:any[]):any
  export function saveWorldData(...args:any[]):any
  export function compareValues(...args:any[]):any
  export function getStepTimeout(...args:any[]):any
  export function getWorldLocator(...args:any[]):any
  export function getFromWorldPath(...args:any[]):any
  export function greaterLessEqual(...args:any[]):any

  export async function fillInput(...args:any[]):any
  export async function typeInput(...args:any[]):any
  export async function clearInput(...args:any[]):any
  export async function clickElement(...args:any[]):any
  export async function getLocatorProps(...args:any[]):any
  export async function saveWorldLocator(...args:any[]):any
  export async function getLocatorTagName(...args:any[]):any
  export async function getLocatorContent(...args:any[]):any
  export async function callLocatorMethod(...args:any[]):any
  export async function getLocatorAttribute(...args:any[]):any
}

declare module '@GTU/Parkin' {
  type TPMeta = Record<string, any>

  export function BeforeAll(cb:(...args:any[]) => any, meta?:TPMeta):any
  export function BeforeEach(cb:(...args:any[]) => any, meta?:TPMeta):any
  export function AfterAll(cb:(...args:any[]) => any, meta?:TPMeta):any
  export function AfterEach(cb:(...args:any[]) => any, meta?:TPMeta):any

  export function And(desc:string, cb:(...args:any[]) => any, meta?:TPMeta):any
  export function But(desc:string, cb:(...args:any[]) => any, meta?:TPMeta):any
  export function When(desc:string, cb:(...args:any[]) => any, meta?:TPMeta):any
  export function Then(desc:string, cb:(...args:any[]) => any, meta?:TPMeta):any
  export function Given(desc:string, cb:(...args:any[]) => any, meta?:TPMeta):any
}

declare module '@GTU/Constants' {
  export const SavedLocatorWorldPath:string
  export var ExpressionKinds:Record<string, string>
  export var ExpressionTypes:Record<string, string>
}

