jest.resetModules()
jest.resetAllMocks()
jest.clearAllMocks()

import { Exam } from './Exam'
import { ExamCfg } from '@GEX/constants'

describe(`Exam`, () => {
  describe(`new Exam`, () => {

    it(`should create a new Exam instance`, () => {
      
      const exam = new Exam(ExamCfg, `test-exam-1`)
      
      // console.log(`------- exam -------`)
      // console.log(exam)
      
      
    })

  })
  
})