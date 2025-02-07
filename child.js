process.on("message", (message) => {
  const { operation, number, num1, num2 } = message;

  function is_prime(number) {
    if (number <= 1) return false;
    if (number === 2) return true;
    if (number % 2 === 0) return false;

    for (let i = 3; i <= Math.sqrt(number); i += 2) {
      if (number % i === 0) {
        return false;
      }
    }
    return true;
  }

  let result;
  switch (operation) {
    case "isPrime":
      result = is_prime(number);
      break;
    case "sum":
      result = num1 + num2;
      break;
    case "sub":
      result = num1 - num2;
      break;
    case "mul":
      result = num1 * num2;
      break;
    case "div":
      result = num2 !== 0 ? num1 / num2 : "Division by zero";
      break;
    case "mod":
      result = num2 !== 0 ? num1 % num2 : "Modulus by zero";
      break;
    default:
      result = "Invalid operation";
  }

  process.send(result);
});