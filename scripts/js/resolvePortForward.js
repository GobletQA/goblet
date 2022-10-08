const { exists } = require('@keg-hub/jsutils')

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
  return Boolean(deployment) && exists(port) ? labelSelectorConfig(deployment, port) : ``
}

const generateImgSelector = (isActiveEnv, selector, port) => {
  const deployment = process.env[isActiveEnv]
  return Boolean(deployment) && exists(port) ? imageSelectorConfig(selector, port) : ``
}

const [
  feActive,
  fePort,
  beActive,
  bePort,
  ctlActive,
  ctlPort,
  ctlAdminPort
] = process.argv.slice(2)

const fePortForward = generateLabelSelector(feActive, fePort)
const bePortForward = generateLabelSelector(beActive, bePort)
const ctlPortForward = generateLabelSelector(ctlActive, ctlPort)
const ctlAdminPortForward = generateLabelSelector(ctlActive, ctlAdminPort)

let portForward = ``
fePortForward && (portForward += fePortForward)
bePortForward && (portForward += bePortForward)
ctlPortForward && (portForward += ctlPortForward)
ctlPortForward && (portForward += ctlAdminPortForward)

/**
  * Check if the app is being deploy
  * If it is, build the sync config based off the deployment
  */
process.stdout.write(portForward)
