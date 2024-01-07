jest.resetModules()
jest.clearAllMocks()

import os from 'os'
import { getCPUCount, resetCPUCount } from '../getCPUCount'
import { toNum } from '@keg-hub/jsutils/toNum'


jest.mock(`@keg-hub/jsutils`, () => {
  return {
    toNum: jest.fn(val => parseInt(val ?? 10)),
    exists: jest.fn(val => val !== undefined && val !== null),
  }
})


jest.mock('os', () => ({
  cpus: jest.fn(),
}))

describe('getCPUCount', () => {
  beforeEach(() => {
    resetCPUCount()
    delete process.env.EXAM_CPU_AMOUNT
    delete process.env.EXAM_ENV
    delete process.env.EXAM_DEV_CLI
    jest.clearAllMocks()
  })

  it(`should return the correct CPU count when the ENV is set`, () => {
    /** This is only used in when testing to ensure the CPU CORE are consistent */
    process.env.EXAM_CPU_AMOUNT = `10`
    process.env.EXAM_ENV = `1`
    process.env.EXAM_DEV_CLI = `1`

    expect(getCPUCount()).toBe(10)
  })

  it(`should return the stored CPU count if __CpuCount is already set`, () => {
    const expectedCpuCount = 9

    // @ts-ignore
    toNum.mockReturnValue(expectedCpuCount)
    // @ts-ignore
    os.cpus.mockReturnValue([1,2,3,4,5,6,7,8,9,0])
    
    const first = getCPUCount()

    // @ts-ignore
    toNum.mockClear()
    const result = getCPUCount()

    expect(toNum).not.toHaveBeenCalled()
    expect(result).toEqual(expectedCpuCount)
  })

  it(`should return the CPU count from environment variables if they exist`, () => {

    // @ts-ignore
    toNum.mockReturnValue(8)

    process.env.EXAM_ENV = `1`
    process.env.EXAM_DEV_CLI = `1`
    process.env.EXAM_CPU_AMOUNT = `8`

    const result = getCPUCount()

    expect(toNum).toHaveBeenCalledWith(`8`)
    expect(result).toEqual(8)
  })

  it(`should return the CPU count using os.cpus() if environment variables do not exist`, () => {
    const cpusMock = [{}, {}, {}]
    ;(os.cpus as jest.Mock).mockReturnValue(cpusMock)

    const result = getCPUCount()

    expect(os.cpus).toHaveBeenCalled()
    expect(result).toEqual(cpusMock.length - 1)
  })
})
