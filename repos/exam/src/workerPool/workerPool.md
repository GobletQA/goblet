# WorkerPool

An easy way to create a pool of worker threads.

## Usage


```js
//main.js
const Pool = require('worker-thread-pool');

const pool = new Pool({
  path: __dirname + '/worker.js'
});
pool.run({name: 'world'})
  .then((result) => {
    //...
  })
```

```js
//worker.js
const { parentPort } = require('worker_threads');

parentPort.on('message', (message) => {
  message.port.postMessage('hello ' + message.name);
  message.port.close();
});
```

## Usage

### Pool(options)

Creates a new pool with workers for the specified javascript file.

#### options

##### path

The path to the javascript file containing the source code to be executed in the thread pool.

##### size (optional)

The size of the thread pool. Defaults to `4`.

### Pool#run(workerData)

Passes the `workerData` to the worker and waits until the worker sends back an answer. Resolves the answer of the worker in a Promise.

### Poll#queueLength()

Returns the current length of the queue.

### Poll#poolLength()

Returns the current size of the pool.

### Pool#close()

Removes all workers from the pool, calls `terminate` on them and then emits a `close` event. 
If an error occurs during an `error` event will be emitted.

