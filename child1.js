const { parentPort, workerData } = require("worker_threads");

const { operation, num1, num2 } = workerData;
let result;

if (operation === "sum") {
  result = num1 + num2;
} else if (operation === "sub") {
  result = num1 - num2;
} else {
  result = null;
}

parentPort.postMessage(result);
