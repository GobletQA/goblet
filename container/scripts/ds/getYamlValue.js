/**
 * Used by devspace in the devspace.yml to dynamically load values
 * Allows loading them from the container/values*.yaml based on NODE_ENV
 */
const { resolveValues, resolveNPMToken } = require('./resolveValues')

/**
 * Gets a value form the values.yml files from passed in arguments
 * @param {string} key - Name of the value to get from the values files
 */
const getFromValues = (key) => {
  if(key === `NPM_TOKEN`) return resolveNPMToken()

  const loadedValues = resolveValues()
  
  switch(key){
    // Add special case statements here as needed
    default:
      return loadedValues[key]
  }
}

/** 
 * Get the args passed to the script
 * First should be the key name of the value to get
 * Second should be a fallback if the key is not found
 * @example
 * node container/scripts/ds/getYamlValue.js MY_KEY_NAME fallback-value
 *
*/
const args = process.argv.slice(2)
const key = args.shift()
const fallback = args.shift() || ''

/** 
 * Write the output to the terminal so devspace can pick up the response
 * Check for an existing env first, then get the value from values.yml, then fallback, finally empty string
 * An empty string is added to ensure 'undefined' || false is not written due to the or ( || ) operator
*/
process.stdout.write(`${process.env[key] || getFromValues(key) || fallback || ''}`)
