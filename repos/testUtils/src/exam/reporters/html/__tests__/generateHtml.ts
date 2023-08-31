import path from 'path'
import { ife } from '@keg-hub/jsutils/ife'
import { HtmlReporter } from '../HtmlReporter'
import { mockEvent } from '../__mocks__/mockEvent'

const rootDir = path.join(__dirname, `../../../../../../../`)
const tempDir = path.join(rootDir, `temp/reports/01--View-My-Apps.html`)

const examCfg = {
  rootDir,
  globals: {
    __goblet: {
      config: {
        paths: {
          rootDir,
          workDir: `temp`,
          reportsDir:  `reports`
        }
      }
    }
  }
  
}

ife(async () => {
  const reporter = new HtmlReporter(examCfg as any, { snapshotOnError: true })
  
  reporter.onRunResult(mockEvent as any)
  // mockEvent as any,  { location: tempDir }

})