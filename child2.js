const { parentPort, workerData } = require("worker_threads");

const { operation, num1, num2, number } = workerData;
let result;

switch (operation) {
  case "mul":
    result = num1 * num2;
    break;
  case "div":
    result = num2 === 0 ? "Division by zero error" : num1 / num2;
    break;
  case "mod":
    result = num2 === 0 ? "Modulus by zero error" : num1 % num2;
    break;
  case "isPrime":
    result = isPrime(number);
    break;
  default:
    result = null;
}

parentPort.postMessage(result);

/**
 * Simple function to check for prime numbers.
 */
function isPrime(n) {
  if (n <= 1) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;
  for (let i = 3; i <= Math.sqrt(n); i += 2) {
    if (n % i === 0) return false;
  }
  return true;
}
