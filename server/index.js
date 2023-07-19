const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const User = require("../server/user.model");
const jwt = require("jsonwebtoken");
app.use(cors());
app.use(express.json());
mongoose.connect(
  "mongodb://localhost:27017/FullMernStack",
  { useNewUrlParser: true },
  { useUnifiedTopology: true }
);

app.post("/api/register", async (req, res) => {
  console.log(req.body);
  try {
    // Check if the email already exists in the database
    const existingUser = await User.findOne({ email: req.body.email });

    if (existingUser) {
      // If the email already exists, throw an error
      return res
        .status(400)
        .json({ status: "error", error: "Duplicate email" });
    }
    await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });

    res.json({ status: "ok" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "error", error: "Internal server error" });
  }
});

app.post("/api/login", async (req, res) => {
  const user = await User.findOne({
    email: req.body.email,
    password: req.body.password,
  });

  if (user) {
    const token = jwt.sign(
      {
        name: user.name,
        email: user.email,
      },
      "secret123"
    );
    return res.json({ status: "ok", user: true, token });
  } else {
    return res.json({ status: "error", user: false });
  }
});
app.listen(3001, () => console.log("server listeing on port 3001"));
