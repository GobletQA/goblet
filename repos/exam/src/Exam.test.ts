jest.resetModules()
jest.resetAllMocks()
jest.clearAllMocks()

import { Exam } from './Exam'
import { Loader } from './Loader'
import { ExamCfg } from '@GEX/constants'

describe(`Exam`, () => {
  describe(`new Exam`, () => {

    it(`should create a new Exam instance`, () => {
      expect(() => {
        const exam = new Exam(ExamCfg, `test-exam-1`)
      }).not.toThrow()
    })

    it(`should should create an instance with an empty config`, () => {
      expect(() => {
        // @ts-ignore
        const exam = new Exam({}, `test-exam-1`)
      }).not.toThrow()
    })

    it(`should create a new loader instance`, () => {
      const exam = new Exam(ExamCfg, `test-exam-1`)
      expect(exam.loader instanceof Loader).toBe(true)
    })

  })

})