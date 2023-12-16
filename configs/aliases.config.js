const path = require('path')
const moduleAlias = require('module-alias')
const { GobletRoot } = require('./gobletRoot')
const { get } = require('@keg-hub/jsutils/get')
const { SUB_REPOS } = require('./paths.config')
const { deepFreeze } = require('@keg-hub/jsutils/deepFreeze')

const isProd = process.env.NODE_ENV === `production`
const ignoreRepos = [
  `EXAMPLE_PATH`,
  `REPOS_PATH`,
  `DEVSPACE_PATH`,
  `TRACE_VIEWER_PATH`
]

/**
 * Helper to loop over some aliases and append the root path to them 
 */
const addAliasRoot = (rootPath, aliases={}) => {
  return Object.entries(aliases)
    .reduce((acc, [key, location]) => {
      acc[key] = path.join(rootPath, location)

      return acc
    }, {})
}

const requireFile = (folder = '', file = '', logError) => {
  const location = path.join(folder, file)

  try {
    // Build the path to the file
    // load the data
    const data = require(location)

    return { data, location }
  }
  catch (err) {
    logError &&
      console.error(`requireFile error for path "${location}"`, err.stack)

    return {}
  }
}


/**
  * Loop over the sub repos locations, and set the path relative to the root directory
  * Find the tsconfig.json file, and check for path aliases
 */
const addRepoAliases = (roots) => {
  return Object.entries(roots).reduce((acc, [repoKey, location]) => {
    if(ignoreRepos.includes(repoKey)) return acc

    // If no data is returned, then try to load paths from tsconfig.json
    // Add true as last argument to see any errors when loading the file
    const tsConfResp = requireFile(location, `tsconfig.json`, !isProd)

    if(!tsConfResp && !isProd){
      console.log(`[Alias Warning] Could not find tsconfig.json at path ${location}`)
      return acc
    }

    const paths = get(tsConfResp, `data.compilerOptions.paths`)

    const data = paths && (
      Object.entries(paths)
        .reduce((locs, [alias, arr]) => {
          const first = arr[0]
          const lowerAlias = alias.toLowerCase()
          if(!first
              || (!lowerAlias.startsWith(`@g`) && !lowerAlias.startsWith(`@ltipton`))
              || first.endsWith(`/*`)
            )
            return locs

          locs[alias] = first

          return locs
        }, {})
    )

    return data ? { ...acc, ...addAliasRoot(location, data), } : acc
  }, {})
}

// aliases shared by jest and module-alias
const aliases = deepFreeze({
  // ---- General Alias ---- //
  GobletRoot,
  // Loop over the sub repos locations, and set the path relative to the root directory
  ...addRepoAliases({GobletRoot, ...SUB_REPOS})
})

// Registers module-alias aliases (done programatically so we can reuse the aliases object for jest)
const registerAliases = () => moduleAlias.addAliases(aliases)

/**
 * Jest is not compatible with module-alias b/c it uses its own require function,
 * and it requires some slight changes to the format of each key and value.
 * `jestAliases` can be set as value of any jest config's `moduleNameMapper` property
 */
const jestAliases = deepFreeze(
  Object.keys(aliases).reduce((aliasMap, key) => {
    const location = aliases[key]

    const ext = path.extname(location)
    if(ext){
      const formattedKey = `^${key}$`
      aliasMap[formattedKey] = location
    }
    else {
      aliasMap[`^${key}$`] = location
      aliasMap[`^${key}/(.*)$`] = `${location}/$1`
    }

    return aliasMap
  }, {})
)

module.exports = {
  aliases,
  registerAliases,
  jestAliases,
}
