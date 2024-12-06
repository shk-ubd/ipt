import express from "express";
import WorkoutModel from "../models/workoutmodel.js";
import mongoose from "mongoose";

const WorkoutRouter = express.Router();

// Get all workouts for the authenticated user
WorkoutRouter.get("/", async (req, res) => {
  const email = req.query.email; // Extract email from query parameters

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    // Find workouts directly based on the email field
    const workouts = await WorkoutModel.find({ useremail: email }).sort({
      createdAt: -1,
    });

    if (!workouts.length) {
      return res
        .status(404)
        .json({ error: "No workouts found for the given email" });
    }

    res.status(200).json(workouts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch workouts" });
  }
});

// Get a single workout by ID
WorkoutRouter.get("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "No such workout" });
    }
    const workout = await WorkoutModel.findById(id);
    if (!workout) {
      return res.status(404).json({ error: "Workout not found" });
    }
    res.status(200).json(workout);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Create a new workout
WorkoutRouter.post("/", async (req, res) => {
  const { useremail, title, reps, load } = req.body;
  const emptyFields = [];
  if (!title) emptyFields.push("title");
  if (!reps) emptyFields.push("reps");
  if (!load) emptyFields.push("load");

  if (emptyFields.length > 0) {
    return res
      .status(400)
      .json({ error: "Please fill all the fields", emptyFields });
  }

  try {
    const workout = await WorkoutModel.create({ title, reps, load, useremail });
    res.status(200).json(workout);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a workout by ID
WorkoutRouter.delete("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "No such workout" });
    }
    const workout = await WorkoutModel.findByIdAndDelete(id);
    if (!workout) {
      return res.status(404).json({ error: "Workout not found" });
    }
    res.status(200).json(workout);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default WorkoutRouter;
