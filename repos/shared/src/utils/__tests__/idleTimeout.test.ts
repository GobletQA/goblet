/**
 * idleTimeout is handled via a shell script, so these test are no longer valid
 */



// import { exec } from 'child_process'
// import { startSup, stopSup, loopConnectionsCheck } from '../idleTimeout'

// jest.mock('child_process')

// import {toBool, toNum} from '@keg-hub/jsutils'

// const GB_SC_IDLE_INTERVAL = 20
// const GB_SC_IDLE_WAIT_TO_START = 180
// const GB_SC_IDLE_CONNECTION_THRESHOLD = 1


// describe('startSup', () => {
//   it('should start supervisor with the correct command', () => {
//     startSup()
//     expect(exec).toHaveBeenCalledWith(
//       'supervisord -n -c configs/supervisord.conf',
//       expect.any(Function)
//     )
//   })
// })

// describe('stopSup', () => {
//   it('should stop supervisor with the correct command', () => {
//     stopSup()
//     expect(exec).toHaveBeenCalledWith(
//       'supervisorctl -c configs/supervisord.conf shutdown all',
//       expect.any(Function)
//     )
//   })

//   it('should kill the tail process in local environment', () => {
//     process.env.NODE_ENV = 'local'
//     // @ts-ignore
//     exec.mockImplementation((command, callback) => {
//       if (command.includes('/dev/null')) {
//         callback(null, '1234', null)
//       } else {
//         callback(null, null, null)
//       }
//     })

//     stopSup()
//     expect(exec).toHaveBeenCalledWith('ps -ef | grep /dev/null | grep -v grep | awk \'{print $2}\'', expect.any(Function))
//     expect(exec).toHaveBeenCalledWith('kill -9 1234', expect.any(Function))
//   })
// })

// describe('loopConnectionsCheck', () => {
//   let originalLog: typeof console.log
//   let logOutput: any[]

//   beforeEach(() => {
//     originalLog = console.log
//     logOutput = []
//     console.log = jest.fn((...args) => {
//       logOutput.push(args)
//     })
//   })

//   afterEach(() => {
//     console.log = originalLog
//   })

//   it('should wait and start the idle timeout check', () => {
//     jest.useFakeTimers()

//     loopConnectionsCheck()

//     expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), GB_SC_IDLE_WAIT_TO_START * 1000)
//     expect(logOutput).toEqual([['Waiting', GB_SC_IDLE_WAIT_TO_START, 'seconds to start Container idle check...']])

//     jest.advanceTimersByTime(GB_SC_IDLE_WAIT_TO_START * 1000)

//     expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), GB_SC_IDLE_INTERVAL * 1000)
//     expect(logOutput).toEqual([
//       ['Waiting', GB_SC_IDLE_WAIT_TO_START, 'seconds to start Container idle check...'],
//       ['Starting idle timeout check...'],
//     ])

//     jest.clearAllTimers()
//   })

//   it('should check active network connections and handle idle container', () => {
//     jest.useFakeTimers()

//     // @ts-ignore
//     exec.mockImplementation((command, callback) => {
//       if (command.includes('netstat')) {
//         callback(null, '2', null) // Simulate 2 active connections
//       }
//       else {
//         callback(null, null, null)
//       }
//     })

//     loopConnectionsCheck()

//     jest.advanceTimersByTime(GB_SC_IDLE_WAIT_TO_START * 1000)
//     jest.advanceTimersByTime(GB_SC_IDLE_INTERVAL * 1000)

//     expect(exec).toHaveBeenCalledWith('netstat -an | grep ESTABLISHED | grep -v 26370 | wc -l', expect.any(Function))
//     expect(logOutput).toEqual([
//       ['Waiting', GB_SC_IDLE_WAIT_TO_START, 'seconds to start Container idle check...'],
//       ['Starting idle timeout check...'],
//       ['Checking active network connections...'],
//       ['Found', 2, 'active connections'],
//       ['Container passed idle connections check. Reset container idle count to', 0],
//     ])

//     jest.advanceTimersByTime(GB_SC_IDLE_INTERVAL * 1000)

//     expect(exec).toHaveBeenCalledWith('netstat -an | grep ESTABLISHED | grep -v 26370 | wc -l', expect.any(Function))
//     expect(logOutput).toEqual([
//       ['Waiting', GB_SC_IDLE_WAIT_TO_START, 'seconds to start Container idle check...'],
//       ['Starting idle timeout check...'],
//       ['Checking active network connections...'],
//       ['Found', 2, 'active connections'],
//       ['Container passed idle connections check. Reset container idle count to', 0],
//       ['Checking active network connections...'],
//       ['Found', 2, 'active connections'],
//       ['Container passed idle connections check. Reset container idle count to', 0],
//     ])

//     jest.advanceTimersByTime(GB_SC_IDLE_INTERVAL * 1000)

//     expect(exec).toHaveBeenCalledWith('netstat -an | grep ESTABLISHED | grep -v 26370 | wc -l', expect.any(Function))
//     expect(logOutput).toEqual([
//       ['Waiting', GB_SC_IDLE_WAIT_TO_START, 'seconds to start Container idle check...'],
//       ['Starting idle timeout check...'],
//       ['Checking active network connections...'],
//       ['Found', 2, 'active connections'],
//       ['Container passed idle connections check. Reset container idle count to', 0],
//       ['Checking active network connections...'],
//       ['Found', 2, 'active connections'],
//       ['Container passed idle connections check. Reset container idle count to', 0],
//       ['Checking active network connections...'],
//       ['Found', 2, 'active connections'],
//       ['Container passed idle connections check. Reset container idle count to', 0],
//     ])

//     jest.advanceTimersByTime(GB_SC_IDLE_INTERVAL * 1000)

//     expect(exec).toHaveBeenCalledWith('netstat -an | grep ESTABLISHED | grep -v 26370 | wc -l', expect.any(Function))
//     expect(logOutput).toEqual([
//       ['Waiting', GB_SC_IDLE_WAIT_TO_START, 'seconds to start Container idle check...'],
//       ['Starting idle timeout check...'],
//       ['Checking active network connections...'],
//       ['Found', 2, 'active connections'],
//       ['Container passed idle connections check. Reset container idle count to', 0],
//       ['Checking active network connections...'],
//       ['Found', 2, 'active connections'],
//       ['Container passed idle connections check. Reset container idle count to', 0],
//       ['Checking active network connections...'],
//       ['Found', 2, 'active connections'],
//       ['Container passed idle connections check. Reset container idle count to', 0],
//       ['Checking active network connections...'],
//       ['Found', 2, 'active connections'],
//       ['Container passed idle connections check. Reset container idle count to', 0],
//     ])

//     jest.clearAllTimers()
//   })

//   it('should handle idle container and stop supervisor', () => {
//     jest.useFakeTimers()

//     // @ts-ignore
//     exec.mockImplementation((command, callback) => {
//       if (command.includes('netstat')) {
//         callback(null, '0', null) // Simulate 0 active connections
//       } else {
//         callback(null, null, null)
//       }
//     })

//     loopConnectionsCheck()

//     jest.advanceTimersByTime(GB_SC_IDLE_WAIT_TO_START * 1000)
//     jest.advanceTimersByTime(GB_SC_IDLE_INTERVAL * 1000)

//     jest.advanceTimersByTime(GB_SC_IDLE_INTERVAL * 1000)

//     expect(exec).toHaveBeenCalledWith('netstat -an | grep ESTABLISHED | grep -v 26370 | wc -l', expect.any(Function))
//     expect(logOutput).toEqual([
//       ['Waiting', GB_SC_IDLE_WAIT_TO_START, 'seconds to start Container idle check...'],
//       ['Starting idle timeout check...'],
//       ['Checking active network connections...'],
//       ['Found', 0, 'active connections'],
//       ['The active connections count of', 0, 'is less or equal to the', GB_SC_IDLE_CONNECTION_THRESHOLD, 'connections threshold'],
//       ['Container is considered idle due to consecutive connection checks, shutting down...'],
//     ])

//     expect(exec).toHaveBeenCalledWith(
//       'supervisorctl -c configs/supervisord.conf shutdown all',
//       expect.any(Function)
//     )

//     jest.clearAllTimers()
//   })
// })
