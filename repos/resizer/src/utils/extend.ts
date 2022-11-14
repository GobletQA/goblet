
export const extend = (...args:Record<any, any>[]) => {
  const first = args.shift()
  return Object.assign(first, ...args)
}
