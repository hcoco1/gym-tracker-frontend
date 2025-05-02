"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { EXERCISES } from "../data/exercises";
import WorkoutCards from "./WorkoutCards";

export type WorkoutSet = {
  id?: number; // Add this line for the backend ID
  exercise: string;
  set_number: number;
  reps: number;
  weight: number;
  day: string;
  type: string;
  date?: string;
};

export default function AddWorkoutForm() {
  const [sets, setSets] = useState<WorkoutSet[]>([]);
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedExercise, setSelectedExercise] = useState("");
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");
  const [availableExercises, setAvailableExercises] = useState<string[]>([]);
  const [workouts, setWorkouts] = useState<WorkoutSet[]>([]);
  const [currentExercise, setCurrentExercise] = useState("");

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await axios.get("http://localhost:8000/workouts/");
        setWorkouts(response.data);
      } catch (error) {
        console.error("Error fetching workouts:", error);
      }
    };
    fetchWorkouts();
  }, []);

  // Update available exercises when day changes
  useEffect(() => {
    if (selectedDay) {
      const dayData = EXERCISES.find((d) => d.day === selectedDay);
      setAvailableExercises(dayData?.exercises || []);
      setSelectedExercise(""); // Reset exercise selection
    }
  }, [selectedDay]);

  const addSet = () => {
    if (selectedDay && selectedExercise && reps && weight) {
      const dayType = EXERCISES.find((d) => d.day === selectedDay)?.type || "";

      const newSet: WorkoutSet = {
        day: selectedDay,
        type: dayType,
        exercise: selectedExercise,
        set_number:
          sets.filter((s) => s.exercise === selectedExercise).length + 1,
        reps: parseInt(reps),
        weight: parseFloat(weight),
      };

      setSets([...sets, newSet]);
      setReps("");
      setWeight("");
    }
  };

  // WorkoutList.tsx
  const submitWorkout = async () => {
    try {
      const setsWithDate = sets.map((set) => ({
        ...set,
        date: new Date().toISOString(),
      }));

      const response = await axios.post(
        "http://localhost:8000/workouts/",
        setsWithDate,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Update local state with returned data
      setWorkouts((prev) => [...prev, ...response.data]);

      // Clear form
      setSets([]);
      setSelectedDay("");
      setCurrentExercise("");
    } catch (error) {
      console.error("Submission failed:", error);
      if (axios.isAxiosError(error)) {
        alert(`Error: ${error.response?.data?.detail || "Unknown error"}`);
      } else {
        alert("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      {/* Day Selection */}
      <div className="space-y-2">
        <label className="block font-medium">Training Day</label>
        <select
          value={selectedDay}
          onChange={(e) => setSelectedDay(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">Select Training Day</option>
          {EXERCISES.map((dayGroup) => (
            <option key={dayGroup.day} value={dayGroup.day}>
              {dayGroup.day} - {dayGroup.type}
            </option>
          ))}
        </select>
      </div>

      {/* Exercise Selection */}
      {selectedDay && (
        <div className="space-y-2">
          <label className="block font-medium">Exercise</label>
          <select
            value={selectedExercise}
            onChange={(e) => setSelectedExercise(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Exercise</option>
            {availableExercises.map((exercise) => (
              <option key={exercise} value={exercise}>
                {exercise}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Reps/Weight Inputs */}
      {selectedExercise && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block font-medium">Reps</label>
            <input
              type="number"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Number of reps"
            />
          </div>

          <div className="space-y-2">
            <label className="block font-medium">Weight (lbs)</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Weight used"
            />
          </div>
        </div>
      )}

      {/* Add Set Button */}
      {selectedExercise && (
        <button
          onClick={addSet}
          disabled={!reps || !weight}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          Add Set ➕
        </button>
      )}

      {/* Added Sets Preview */}
      {sets.length > 0 && (
        <div className="mt-6">
          <h3 className="font-medium mb-2">Sets to be saved:</h3>
          <div className="space-y-2">
            {sets.map((set, index) => (
              <div key={index} className="p-2 border rounded bg-gray-50">
                <span className="font-medium">{set.exercise}</span> - Set{" "}
                {set.set_number}: {set.reps} reps @ {set.weight}lbs
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Save Button */}
      {sets.length > 0 && (
        <button
          onClick={submitWorkout}
          className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mt-4"
        >
          Save All Sets 💾
        </button>
      )}
      <WorkoutCards
        workouts={workouts}
        onDelete={(setId) =>
          setWorkouts((prev) => prev.filter((w) => w.id !== setId))
        }
      />
    </div>
  );
}
