const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");

const app = express();

mongoose.set("bufferCommands", false);

const MONGO_URI = "mongodb+srv://sayantika13banik_db_user:Ts13%401989@cluster0.s8vypth.mongodb.net/safestray?retryWrites=true&w=majority";

mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB connected "))
  .catch(err => console.log(err));

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));


const fileFilter = (req, file, cb) => {
  const allowed = /jpg|jpeg|png|webp/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype);

  if (ext && mime) cb(null, true);
  else cb("Only images allowed !", false);
};


const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage, fileFilter });


const CaseSchema = new mongoose.Schema({
  animal: String,
  description: String,
  lat: Number,
  lng: Number,
  image: String,
  status: String
});

const Case = mongoose.model("Case", CaseSchema);


app.get("/", (req, res) => {
  res.send("Backend running ");
});

app.post("/report", async (req, res) => {
  try {
    const { lat, lng, animal, image } = req.body;

    if (!lat || !lng) {
      return res.status(400).json({ error: "Location required" });
    }

    if (!animal) {
      return res.status(400).json({ error: "Animal required" });
    }

    const newCase = new Case({
      animal,
      description: req.body.description,
      lat,
      lng,
      image, 
      status: "Pending"
    });

    await newCase.save();
    res.json(newCase);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.toString() });
  }
});
app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  res.json({
    filename: req.file.filename
  });
});
app.get("/cases", async (req, res) => {
  const cases = await Case.find();
  res.json(cases);
});

app.listen(5000, () => {
  console.log("Server running on port 5000 🚀");
});