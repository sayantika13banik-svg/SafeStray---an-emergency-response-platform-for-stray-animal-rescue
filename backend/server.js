const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
let cases = [];

// POST - add case
app.post("/report", (req, res) => {
  const newCase = {
    id: Date.now(),
    ...req.body,
    status: "Pending",
  };

  cases.push(newCase);
  res.json(newCase);
});

// GET - all cases
app.get("/cases", (req, res) => {
  res.json(cases);
});