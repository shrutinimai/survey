const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/surveydb");

const UserSchema = new mongoose.Schema({
  email: String,
  password: String
});

const SurveySchema = new mongoose.Schema({
  title: String,
  question: String,
  options: [String],
  responses: [String]
});

const User = mongoose.model("User", UserSchema);
const Survey = mongoose.model("Survey", SurveySchema);

app.post("/register", async (req, res) => {
  const hashed = await bcrypt.hash(req.body.password, 10);
  await User.create({ email: req.body.email, password: hashed });
  res.send("User Registered");
});

app.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.send("User not found");

  const match = await bcrypt.compare(req.body.password, user.password);
  if (!match) return res.send("Wrong password");

  const token = jwt.sign({ id: user._id }, "secret");
  res.json({ token });
});

app.post("/survey", async (req, res) => {
  const survey = await Survey.create(req.body);
  res.json(survey);
});

app.get("/survey", async (req, res) => {
  const surveys = await Survey.find();
  res.json(surveys);
});

app.post("/survey/:id", async (req, res) => {
  const survey = await Survey.findById(req.params.id);
  survey.responses.push(req.body.answer);
  await survey.save();
  res.send("Response saved");
});

app.listen(5000, () => console.log("Backend running on port 5000"));
