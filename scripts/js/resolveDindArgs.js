const { resolveValues } = require('./resolveValues')

const envs = resolveValues()
const isSecure = `${envs.GB_DD_PORT}` === `2376` && !Boolean(envs.GB_CD_LOCAL_DEV_MODE)

const args = isSecure
  ? [
      `"--tlsverify"`,
      `"--tlscacert=/etc/docker/certs.d/ca-public.pem"`,
      `"--tlscert=/etc/docker/certs.d/certificate.pem"`,
      `"--tlskey=/etc/docker/certs.d/server-key.pem"`,
      `"--host=tcp://${envs.GB_DD_HOST}:${envs.GB_DD_PORT}"`
    ]
  : [
      `"--tls=false"`,
      `"--host=unix:///var/run/docker.sock"`,
      `"--host=tcp://${envs.GB_DD_HOST}:${envs.GB_DD_PORT}"`
    ]

process.stdout.write(`[${args.join(', ')}]`)
