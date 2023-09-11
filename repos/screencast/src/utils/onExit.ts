

export const onExit = (socketMgr:any) => {
  const exitApp = (exitType:number|string, exitCode:number) => {
    console.log(`[Screencast] Waiting screencast to clean up...`)
    socketMgr?.close?.()
    const code = typeof exitType === `number`
      ? exitType
      : typeof exitCode === `number`
        ? exitCode
        : console.log(`Exiting with code ${exitCode || exitType}`)

    // @ts-ignore
    process.exit(code)
  }



  [`SIGINT`, `SIGUSR1`, `SIGUSR2`, `SIGTERM`].forEach(evt => process.once(evt, exitApp))

}

