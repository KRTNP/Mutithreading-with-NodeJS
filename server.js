const express = require("express");
const { fork } = require("child_process");
const path = require("path");
const app = express();

function runService(workerData) {
  return new Promise((resolve, reject) => {
    const worker = fork(path.resolve(__dirname, "child.js"));
    worker.send(workerData);
    worker.on("message", resolve);
    worker.on("error", reject);
    worker.on("exit", (code) => {
      if (code !== 0) reject(new Error(`Worker stopped with exit code ${code}`));
    });
  });
}

app.get("/num", async (req, res) => {
  const num = parseInt(req.query.num, 10);
  if (isNaN(num)) {
    return res.status(400).json({ error: "Invalid number" });
  }
  try {
    const isPrime = await runService({ operation: "isPrime", number: num });
    const result = { number: num, isPrime };
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/:num1/:num2", async (req, res) => {
  const num1 = parseInt(req.params.num1, 10);
  const num2 = parseInt(req.params.num2, 10);
  if (isNaN(num1) || isNaN(num2)) {
    return res.status(400).json({ error: "Invalid numbers" });
  }
  try {
    const [isPrime1, isPrime2] = await Promise.all([
      runService({ operation: "isPrime", number: num1 }),
      runService({ operation: "isPrime", number: num2 })
    ]);
    const result1 = { number: num1, isPrime: isPrime1 };
    const result2 = { number: num2, isPrime: isPrime2 };
    res.json({ result1, result2 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/sum/:num1/:num2", async (req, res) => {
  const num1 = parseInt(req.params.num1, 10);
  const num2 = parseInt(req.params.num2, 10);
  if (isNaN(num1) || isNaN(num2)) {
    return res.status(400).json({ error: "Invalid numbers" });
  }
  try {
    const sum = await runService({ operation: "sum", num1, num2 });
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
    const difference = await runService({ operation: "sub", num1, num2 });
    res.json({ difference });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/mul/:num1/:num2", async (req, res) => {
  const num1 = parseInt(req.params.num1, 10);
  const num2 = parseInt(req.params.num2, 10);
  if (isNaN(num1) || isNaN(num2)) {
    return res.status(400).json({ error: "Invalid numbers" });
  }
  try {
    const product = await runService({ operation: "mul", num1, num2 });
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
    const quotient = await runService({ operation: "div", num1, num2 });
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
    const modulus = await runService({ operation: "mod", num1, num2 });
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