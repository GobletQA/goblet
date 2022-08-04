/**
 * Used by devspace in the devspace.yml to dynamically forward ports for the application deployment
 * Ensures only deployed apps actually get their ports forwarded to the host
 */

const labelSelectorConfig = (selector, port) => (`
- labelSelector:
    app.kubernetes.io/component: ${selector}
  forward:
  - port: ${port}
`)

const imageSelectorConfig = (selector, port) => (`
- imageSelector: ${selector}
  forward:
  - port: ${port}
`)

const generateLabelSelector = (isActiveEnv, port) => {
  const deployment = process.env[isActiveEnv]
  return Boolean(deployment) ? labelSelectorConfig(deployment, port) : ``
}

const generateImgSelector = (isActiveEnv, selector, port) => {
  const deployment = process.env[isActiveEnv]
  return Boolean(deployment) ? imageSelectorConfig(selector, port) : ``
}

const [
  beActive,
  bePort,
  feActive,
  fePort,
] = process.argv.slice(2)

const bePortForward = generateLabelSelector(beActive, bePort)
const fePortForward = generateLabelSelector(feActive, fePort)

let portForward = ``
bePortForward && (portForward += bePortForward)
fePortForward && (portForward += fePortForward)

/**
  * Check if the app is being deploy
  * If it is, build the sync config based off the deployment
  */
process.stdout.write(portForward)
