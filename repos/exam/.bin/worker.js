// src/bin/worker.ts
var path = require("path");
var { isMainThread } = require("worker_threads");
(async () => {
  if (isMainThread)
    return;
  require("esbuild-register/dist/node").register({});
  require(path.resolve(__dirname, `./workerPipeline.js`));
})();
//# sourceMappingURL=worker.js.map
