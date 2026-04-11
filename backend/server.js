const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const CaseSchema = new mongoose.Schema({
  description: String,
  lat: Number,
  lng: Number,
  status: String,
});

const Case = mongoose.model("Case", CaseSchema);
const app = express();
mongoose.connect("mongodb+srv://sayantika13banik_db_user:Ts13%401989@cluster0.s8vypth.mongodb.net/safestray?retryWrites=true&w=majority")
  .then(() => console.log("MongoDB connected ✅"))
  .catch((err) => console.log(err));

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
app.post("/report", async (req, res) => {
  const newCase = new Case({
    ...req.body,
    status: "Pending",
  });

  await newCase.save();
  res.json(newCase);
});

// GET - all cases
app.get("/cases", async (req, res) => {
  const cases = await Case.find();
  res.json(cases);
});