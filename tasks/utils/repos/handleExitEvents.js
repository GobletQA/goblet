const { Logger } = require('@keg-hub/cli-utils')

const handleExitEvents = (response) => {
  response.forEach((cmdResponses) => {
    cmdResponses &&
      cmdResponses.length &&
      cmdResponses.forEach((exitEvent) => {
        if (!exitEvent || !exitEvent.exitCode) return

        Logger.empty()
        Logger.label(
          `[${exitEvent.repo}]`,
          [
            Logger.colors.white(`Task`),
            Logger.colors.red(exitEvent.command),
            Logger.colors.white(`failed with exit code`),
            Logger.colors.yellow(exitEvent.exitCode),
          ].join(' ')
        )
        Logger.empty()
        process.exit(exitEvent.exitCode)
      })
  })
}

module.exports = {
  handleExitEvents,
}
