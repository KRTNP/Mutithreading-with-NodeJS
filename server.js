const express = require("express");
const { runWorker } = require("./parent");
const app = express();

/**
 * Endpoint to check if a number is prime.
 * Uses child2.js because prime checking is considered an advanced operation.
 */
app.get("/num", async (req, res) => {
  const number = parseInt(req.query.num, 10);
  if (isNaN(number)) {
    return res.status(400).json({ error: "Invalid number" });
  }
  try {
    const isPrime = await runWorker("./child2.js", {
      operation: "isPrime",
      number
    });
    res.json({ number, isPrime });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Endpoint to check two numbers for primality concurrently.
 * Both workers use child2.js.
 */
app.get("/:num1/:num2", async (req, res) => {
  const num1 = parseInt(req.params.num1, 10);
  const num2 = parseInt(req.params.num2, 10);
  if (isNaN(num1) || isNaN(num2)) {
    return res.status(400).json({ error: "Invalid numbers" });
  }
  try {
    const [isPrime1, isPrime2] = await Promise.all([
      runWorker("./child2.js", { operation: "isPrime", number: num1 }),
      runWorker("./child2.js", { operation: "isPrime", number: num2 })
    ]);
    res.json({
      result1: { number: num1, isPrime: isPrime1 },
      result2: { number: num2, isPrime: isPrime2 }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Endpoints for basic arithmetic operations (addition and subtraction)
 * These are handled by child1.js.
 */
app.get("/sum/:num1/:num2", async (req, res) => {
  const num1 = parseInt(req.params.num1, 10);
  const num2 = parseInt(req.params.num2, 10);
  if (isNaN(num1) || isNaN(num2)) {
    return res.status(400).json({ error: "Invalid numbers" });
  }
  try {
    const sum = await runWorker("./child1.js", {
      operation: "sum",
      num1,
      num2
    });
    res.json({ sum });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/sub/:num1/:num2", async (req, res) => {
  const num1 = parseInt(req.params.num1, 10);
  const num2 = parseInt(req.params.num2, 10);
  if (isNaN(num1) || isNaN(num2)) {
    return res.status(400).json({ error: "Invalid numbers" });
  }
  try {
    const difference = await runWorker("./child1.js", {
      operation: "sub",
      num1,
      num2
    });
    res.json({ difference });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Endpoints for advanced arithmetic operations (multiplication, division, modulus)
 * These are handled by child2.js.
 */
app.get("/mul/:num1/:num2", async (req, res) => {
  const num1 = parseInt(req.params.num1, 10);
  const num2 = parseInt(req.params.num2, 10);
  if (isNaN(num1) || isNaN(num2)) {
    return res.status(400).json({ error: "Invalid numbers" });
  }
  try {
    const product = await runWorker("./child2.js", {
      operation: "mul",
      num1,
      num2
    });
    res.json({ product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/div/:num1/:num2", async (req, res) => {
  const num1 = parseInt(req.params.num1, 10);
  const num2 = parseInt(req.params.num2, 10);
  if (isNaN(num1) || isNaN(num2) || num2 === 0) {
    return res.status(400).json({ error: "Invalid numbers or division by zero" });
  }
  try {
    const quotient = await runWorker("./child2.js", {
      operation: "div",
      num1,
      num2
    });
    res.json({ quotient });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/mod/:num1/:num2", async (req, res) => {
  const num1 = parseInt(req.params.num1, 10);
  const num2 = parseInt(req.params.num2, 10);
  if (isNaN(num1) || isNaN(num2) || num2 === 0) {
    return res.status(400).json({ error: "Invalid numbers or modulus by zero" });
  }
  try {
    const modulus = await runWorker("./child2.js", {
      operation: "mod",
      num1,
      num2
    });
    res.json({ modulus });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
  console.log("http://localhost:3000/num?num=7");
  console.log("http://localhost:3000/7/11");
  console.log("http://localhost:3000/sum/7/11");
  console.log("http://localhost:3000/sub/7/11");
  console.log("http://localhost:3000/mul/7/11");
  console.log("http://localhost:3000/div/7/11");
  console.log("http://localhost:3000/mod/7/11");
});
