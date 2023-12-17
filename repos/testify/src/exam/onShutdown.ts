/**
 * Executed by exam once all tests are finished and the process is about to shutdown
 * If running in workers it is called right before a worker is shutdown
 *   - Which means it could be called multiple times, once for each worker
 * If running on the host machine, it will only be called once
 */

 ;(async () => {
    if(!global.browser) return

    await global.browser.close()
    global.browser = undefined
 })()
 
 export {}