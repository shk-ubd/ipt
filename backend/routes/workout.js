const express = require("express");
const requireAuth = require("../middleware/requireauth");
const workoutmodel = require("../models/workoutmodel");
const { default: mongoose } = require("mongoose");

const router = express.Router();

router.use(requireAuth);

router.get("/", async (req, res) => {
  const user_id = req.user._id;
  try {
    const workout = await workoutmodel
      .find({ user_id })
      .sort({ createdAt: -1 });
    res.status(200).json(workout);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  const Id = req.params.id;

  try {
    if (!mongoose.Types.ObjectId.isValid(Id)) {
      return res.status(400).json({ error: "no such workout " });
    }
    const workout = await workoutmodel.findById(Id);
    res.status(200).json(workout);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  const { title, reps, load } = req.body;

  let emptyfield = [];
  if (!title) {
    emptyfield.push("title");
  }
  if (!reps) {
    emptyfield.push("reps");
  }
  if (!load) {
    emptyfield.push("load");
  }
  if (emptyfield.length > 0) {
    return res
      .status(400)
      .json({ error: "Please fill all the fields", emptyfield });
  }
  try {
    const user_id = req.user._id;
    const workout = await workoutmodel.create({ title, reps, load, user_id });
    res.status(200).json(workout);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  const Id = req.params.id;
  try {
    if (!mongoose.Types.ObjectId.isValid(Id)) {
      return res.status(400).json({ error: "no such workout " });
    }
    const workout = await workoutmodel.findByIdAndDelete(Id);
    res.status(200).json(workout);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
