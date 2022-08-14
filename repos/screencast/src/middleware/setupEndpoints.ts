
export const setupEndpoints = async () => {
  try {
    await import('../endpoints')
  }
  catch(err){
    console.log(`[Goblet SC] Error Loading endpoints`)
    console.error(err)

    process.exit(1)
  }
}