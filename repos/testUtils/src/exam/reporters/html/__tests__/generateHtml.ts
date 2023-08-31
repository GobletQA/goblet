import path from 'path'
import { ife } from '@keg-hub/jsutils/ife'
import { generateHtml } from '../generateHtml'
import { mockEvent } from '../__mocks__/mockEvent'

const tempDir = path.join(__dirname, `../../../../../../../temp/reports/01--View-My-Apps.html`)

ife(async () => {
  generateHtml(mockEvent as any,  { location: tempDir })

})