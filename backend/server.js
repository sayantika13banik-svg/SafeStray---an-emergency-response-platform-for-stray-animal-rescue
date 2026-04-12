const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

mongoose.set("bufferCommands", false);


const MONGO_URI = "mongodb+srv://sayantika13banik_db_user:Ts13%401989@cluster0.s8vypth.mongodb.net/safestray?retryWrites=true&w=majority";


async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected ✅");
  } catch (err) {
    console.error("MongoDB FAILED ❌", err);
    process.exit(1);
  }
}


app.use(cors());
app.use(express.json());


const CaseSchema = new mongoose.Schema({
  animal: String,
  description: String,
  lat: Number,
  lng: Number,
  status: String,
});

const Case = mongoose.model("Case", CaseSchema);


app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});


app.post("/report", async (req, res) => {
  try {
    const { lat, lng } = req.body;


    if (!lat || !lng) {
      return res.status(400).json({
        error: "Location is required"
      });
    }

    const newCase = new Case({
      ...req.body,
      status: "Pending",
    });

    await newCase.save();
    res.json(newCase);

  } catch (err) {
    console.error("POST ERROR:", err);
    res.status(500).json({ error: "Error saving report" });
  }
});


app.get("/cases", async (req, res) => {
  try {
    console.log("DB State:", mongoose.connection.readyState); // debug

    const cases = await Case.find();
    res.json(cases);

  } catch (err) {
    console.error("GET ERROR:", err);
    res.status(500).json({ error: "Error fetching cases" });
  }
});


connectDB().then(() => {
  app.listen(5000, () => {
    console.log("Server running on port 5000 🚀");
  });
});


mongoose.connection.on("error", err => {
  console.error("MongoDB runtime error:", err);
});