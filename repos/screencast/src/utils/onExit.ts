

export const onExit = (socketMgr:any) => {

  const exitApp = (exitCode:number) => {
    console.log(`[Screencast] Waiting screencast to clean up...`)
    socketMgr?.close?.()
    process.exit(exitCode)
  }

  [`SIGINT`, `SIGUSR1`, `SIGUSR2`, `SIGTERM`].forEach(evt => process.once(evt, exitApp))

}

