import React, { useContext, useState } from "react";
import { WorkoutContext } from "../context/context";
import { AuthContext } from "../context/authcontext";

export default function WorkoutForm() {
  const [title, setTitle] = useState("");
  const [load, setLoad] = useState("");
  const [reps, setReps] = useState("");
  const [Error, setError] = useState(null);
  const { dispatch } = useContext(WorkoutContext);
  const [emptyfields, setemptyfeids] = useState([]); // Initialized as an empty array
  const { user } = useContext(AuthContext);
  const useremail = user.email;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("You must be logged in");
      return;
    }

    const workout = { useremail, title, load, reps };

    const response = await fetch("http://localhost:4000/workout/", {
      method: "POST",
      body: JSON.stringify(workout),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error);

      // Ensure emptyfields is set to an array, defaulting to an empty array
      setemptyfeids(data.emptyfield || []);
    }

    if (response.ok) {
      setTitle("");
      setLoad("");
      setReps("");
      setError(null);
      setemptyfeids([]); // Reset emptyfields after success
      dispatch({ type: "CREATE_WORKOUT", payload: data });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add a New Workout</h3>

      <label htmlFor="title">Exercise Title: </label>
      <input
        type="text"
        onChange={(e) => {
          setTitle(e.target.value);
        }}
        value={title}
        id="title"
        className={emptyfields.includes("title") ? "error" : ""}
      />
      <label htmlFor="load">Load (in kg): </label>
      <input
        type="number"
        onChange={(e) => {
          setLoad(e.target.value);
        }}
        value={load}
        id="load"
        className={emptyfields.includes("load") ? "error" : ""}
      />

      <label htmlFor="reps">Reps: </label>
      <input
        type="number"
        onChange={(e) => {
          setReps(e.target.value);
        }}
        value={reps}
        id="reps"
        className={emptyfields.includes("reps") ? "error" : ""}
      />

      <button>Add Workout</button>
      {Error && <div className="error">{Error}</div>}
    </form>
  );
}
