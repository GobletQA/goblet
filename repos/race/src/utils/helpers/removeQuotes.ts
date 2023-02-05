

export const removeQuotes = (str:string) => (
  str
    .trim()
    .replace(/^("|')/, '')
    .replace(/("|')$/, '')
)