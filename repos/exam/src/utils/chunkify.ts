

export const chunkify = <T=any>(arr:T[], size:number) => {
  const chunks:string[] = []
  if(size < 1) size = 1

  for (let i = 0; i < arr.length; i += size)
    chunks.push(arr.slice(i, i + size))

  return chunks
}