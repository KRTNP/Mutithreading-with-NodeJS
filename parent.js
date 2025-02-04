const { Worker } = require("worker_threads");
const path = require("path");

/**
 * runWorker spawns a new Worker thread using the given script and workerData.
 * It returns a Promise that resolves with the worker’s message.
 */
function runWorker(script, workerData) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(path.resolve(__dirname, script), { workerData });
    worker.on("message", resolve);
    worker.on("error", reject);
    worker.on("exit", (code) => {
      if (code !== 0)
        reject(new Error(`Worker stopped with exit code ${code}`));
    });
  });
}

module.exports = { runWorker };
