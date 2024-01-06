
export const isBypassRoute = (
  url:string|RegExp,
  routes:Array<string|RegExp>
) => {
  if(url === `/`) return true
  return Boolean(routes.find(route => route !== `/` && url.toString().startsWith(route.toString())))
}
