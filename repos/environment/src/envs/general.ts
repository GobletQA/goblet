

export const general = () => {
  const {
    GB_SUB_REPO,
    FORCE_COLOR=`1`,
    GB_LOG_LEVEL=`info`,
  } = process.env
  
  return {
    FORCE_COLOR,
    GB_SUB_REPO,
    GB_LOG_LEVEL,
  }
}

