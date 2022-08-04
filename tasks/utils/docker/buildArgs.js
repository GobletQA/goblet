const {
  reduceObj,
  isArr,
  noPropArr,
  noOpObj,
} = require('@keg-hub/jsutils')


const asBuildArgArr = (key, value, buildArgArr, filters) => {
  filters = isArr(filters) ? filters : noPropArr

  !filters.includes(key) &&
    value &&
    buildArgArr.push(`--build-arg`, `${key}=${value}`)

  return buildArgArr
}

const toBuildArgsArr = (envs = noOpObj, filters = noPropArr, buildArr = []) => {
  const built = reduceObj(
    envs,
    (key, value, buildArr) => asBuildArgArr(key, value, buildArr, filters),
    buildArr
  )
  return built
}

module.exports = {
  toBuildArgsArr,
  asBuildArgArr,
}
