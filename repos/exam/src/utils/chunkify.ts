
/**
 * Split an array of items up into separate chunks
 */
export const chunkify = <T=any>(arr:T[], size:number) => {
  const chunks:Record<string|number, T[]> = {}
  if(size < 1) size = 1

  for (let i = 0; i < arr.length; i += size)
    chunks[i] = arr.slice(i, i + size)

  return chunks
}