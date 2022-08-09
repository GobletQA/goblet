
// Helper to throw an error when validation fails
export const throwErr = (error:string|Error) => {
  if (typeof error === 'string') throw new Error(error)

  throw error
}
