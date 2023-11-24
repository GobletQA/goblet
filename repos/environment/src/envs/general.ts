
const general = () => {
  const {
    NODE_ENV,
    GOBLET_APP_URL,
    GOBLET_ENV=NODE_ENV,
    DISPLAY=`:0.0`,
    GB_SUB_REPO,
    FORCE_COLOR=`1`,
    GB_LOG_LEVEL=`info`,
    GB_SC_LOG_LEVEL=GB_LOG_LEVEL,
    GOBLET_TEST_COLORS=FORCE_COLOR,
  } = process.env

  return {
    DISPLAY,
    NODE_ENV,
    GOBLET_ENV,
    FORCE_COLOR,
    GB_SUB_REPO,
    GB_LOG_LEVEL,
    GOBLET_APP_URL,
    GB_SC_LOG_LEVEL,
    GOBLET_TEST_COLORS,
  }
}

export default general