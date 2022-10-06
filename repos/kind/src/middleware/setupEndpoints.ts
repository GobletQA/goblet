
export const setupEndpoints = async () => {
  try {
    await import('../endpoints')
  }
  catch(err){
    console.log(`[Goblet KD] Error Loading endpoints`)
    console.error(err)

    process.exit(1)
  }
}