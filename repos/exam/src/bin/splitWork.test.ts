jest.resetModules()
jest.resetAllMocks()
jest.clearAllMocks()

import { doIt } from '@keg-hub/jsutils'
import { splitWork } from './splitWork'
import { ExamCfg } from '@GEX/constants'

type TRuns = [any, any][]

const files = (amt:number, skip=0) => doIt(amt, {}, (idx) => (
  `/test-file${idx + skip + 1}`
))

process.env.EXAM_WORKER_AMOUNT = `10`

const runs:TRuns = [
  [
    {
      title: `Even split - 1 file per worker`,
      chunks: 5,
      workers: 0,
      concurrency: 0
    },
    {
      total: 5,
      workers: 5,
      concurrency: 1,
      chunks: {
        '0': files(1),
        '1': files(1, 1),
        '2': files(1, 2),
        '3': files(1, 3),
        '4': files(1, 4)
      },
    }
  ],
  [
    {
      title: `One off split - More workers with concurrency then files`,
      chunks: 5,
      workers: 10,
      concurrency: 2,
    },
    {
      total: 5,
      workers: 5,
      concurrency: 2,
      chunks: {
        '0': files(2),
        '1': files(2, 2),
        '2': files(1, 4)
      },
    }
  ],
  [
    {
      title: `High single worker concurrency - 1 worker gets all files`,
      chunks: 10,
      workers: 3,
      concurrency: 20,
    },
    {
      total: 10,
      workers: 3,
      concurrency: 20,
      chunks: {
        '0': files(10)
      },
    }
  ],
  [
    {
      title: `Many files split - Even split, with left over jobs`,
      chunks: 21,
      workers: 3,
      concurrency: 6,
    },
    {
      total: 21,
      workers: 3,
      concurrency: 6,
      chunks: {
        '0': files(6),
        '1': files(6, 6),
        '2': files(6, 12),
        '3': files(3, 18),
      },
    }
  ],
  [
    {
      title: `Many workers with low concurrency - 1 per worker, with left over jobs`,
      chunks: 12,
      workers: 10,
      concurrency: 1,
    },
    {
      total: 12,
      workers: 10,
      concurrency: 1,
      chunks: {
        '0': files(1),
        '1': files(1, 1),
        '2': files(1, 2),
        '3': files(1, 3),
        '4': files(1, 4),
        '5': files(1, 5),
        '6': files(1, 6),
        '7': files(1, 7),
        '8': files(1, 8),
        '9': files(1, 9),
        '10': files(1, 10),
        '11': files(1, 11),
      },
    }
  ],
  [
    {
      title: `No workers or concurrency - Default to 1 worker getting all files`,
      chunks: 3
    },
    {
      total: 3,
      workers: 1,
      concurrency: 1,
      chunks: {
        '0': files(3),
      },
    }
  ],
  [
    {
      title: `3 worker | 3 currency | 9 files - Even split of 3 files per worker`,
      chunks: 9,
      workers: 3,
      concurrency: 3,
    },
    {
      total: 9,
      workers: 3,
      concurrency: 3,
      chunks: {
        '0': files(3),
        '1': files(3, 3),
        '2': files(3, 6)
      },
    }
  ],
  [
    {
      title: `When runInBand is "true" - Default to 1 worker getting all files`,
      chunks: 9,
      workers: 3,
      concurrency: 3,
      runInBand: true,
    },
    {
      total: 9,
      workers: 1,
      concurrency: 1,
      chunks: {
        '0': files(9)
      },
    }
  ],
]



describe(`splitWork`, () => {
  const buildCfg = (cfg:any) => ({...ExamCfg, ...cfg})

  const only = runs.filter(item => item[0].only || item[0].debug)
  const list = only.length && only || runs

  list.map((item, idx) => {
    const [{ chunks, title, ...cfg}, outcome] = item
    
    test(title || `Test item ${idx} - generates the correct chunks per worker`, () => {
      const resp = splitWork(buildCfg(cfg), files(chunks))

      item[0].print || item[0].debug
        ? console.log(`Test item ${idx}:\n`, resp)
        : expect(resp).toEqual(outcome)
    })

  })

})