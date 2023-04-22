/**
 * Used by devspace in the devspace.yml to dynamically pull secrets for the application deployment
 * Allows loading them from the container/values*.yaml based on NODE_ENV
 * Test =>  node container/scripts/ds/resolvePullSecrets.js
 */
const { runCmd } = require('@keg-hub/cli-utils')

;(async () => {
  const { data, error, exitCode } = await runCmd(`kubectl`, [
    `get`,
    `secrets`,
    `-o`,
    `json`
  ], { exec: true })
  
  if(exitCode)
    throw new Error(error || `The "kubectl" exited with a non-zero exit code, but provided no error.`)

  const secrets = JSON.parse(data)
  const found = secrets.items.find(secret => secret.metadata.name.startsWith(`devspace`))
  if(!found)
    throw new Error([
      `Could not find a valid devspace secret.`,
      `Run command "pnpm kube secret auth --log" to create the auth secrets`
    ].join(`\n`))

  process.stdout.write(found.metadata.name)
})()
