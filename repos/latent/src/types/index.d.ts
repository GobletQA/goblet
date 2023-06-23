
declare module '@keg-hub/parse-config/src/utils/utils' {
  export function loadTemplate<T=string|Record<string, any>>(
    args: {
      fill:boolean
      error:boolean
      pattern:RegExp
      data:Record<any, any>
      format:`string`|`object`
    },
    content:string,
    loader:(content:string) => Record<string, any>
  ): T
}