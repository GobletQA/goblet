jest.resetModules()
jest.resetAllMocks()
jest.clearAllMocks()

import { Exam } from './Exam'
import { Loader } from './Loader'
import { ExamCfg, NoTestsFoundPass } from '@GEX/constants'
import { getConfig } from './bin/getConfig'
import { cliOpts } from '../__mocks__'
import {TExamConfig} from './types'

const examCfg = getConfig(cliOpts)

describe(`Exam`, () => {

  let examCfg:TExamConfig

  beforeAll(async () => {
    examCfg = await getConfig(cliOpts)
  })

  describe(`new`, () => {

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

  describe(`Exam.run`, () => {

    it(`file - should load pre and post files fore environment and runner files`, async () => {
      expect(global.__examTests).toBe(undefined)
      // @ts-ignore
      const orgExpect = global.expect
      const exam = new Exam(examCfg, `test-id`)
      await exam.run({
        file: `__mocks__/test-file.ts`
      })

      // @ts-ignore
      global.expect = orgExpect

      expect(global.__examTests.preEnvironment).toBe(true)
      expect(global.__examTests.postEnvironment).toBe(true)
      expect(global.__examTests.preRunner).toBe(true)
      expect(global.__examTests.postRunner).toBe(true)
    })


    it(`file - should only the single passed in file`, async () => {
      const exam = new Exam(examCfg, `test-id`)
      await exam.run({
        file: `__mocks__/test-file.ts`
      })
    })

    it(`testMatch - should throw an error when no tests are found`, async () => {
      const exam = new Exam(examCfg, `test-id`)

      await expect(async () => {
        await exam.run({ testMatch: `__mocks__/__tests__/` })
      }).rejects.toThrow()

    })

    it(`should NOT throw when no tests are found and passWithNoTests is true`, async () => {
      const exam = new Exam({...examCfg, passWithNoTests: true}, `test-id`)
      const { timestamp, ...rest } = NoTestsFoundPass

      await expect(
        Promise.resolve()
        .then(async () => {
          const resp = await exam.run({ testMatch: `__mocks__/__tests__/` })
          const {timestamp, ...final} = resp[0]
          return [final]
        })
      )
        .resolves.toEqual(expect.arrayContaining([rest]))

    })

    it(`testMatch - should run all matching files`, async () => {
      const exam = new Exam(examCfg, `test-id`)

      const resp = await exam.run({
        testMatch: `__mocks__/__tests__/*`
      })
      expect(resp?.length).toBe(3)

    })

    it(`should call the clean up method after it finished execution`, async () => {
      const exam = new Exam(examCfg, `test-id`)
      const orgCleanup = exam.cleanup
      exam.cleanup = jest.fn(() => orgCleanup())

      const resp = await exam.run({
        testMatch: `__mocks__/__tests__/*`
      })

      expect(exam.cleanup).toHaveBeenCalled()
      expect(exam.loader).toBe(undefined)
      expect(exam.execute).toBe(undefined)

    })

  })

})