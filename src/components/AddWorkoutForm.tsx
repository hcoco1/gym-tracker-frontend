"use client";
import { useState } from 'react';
import axios from 'axios';
import { EXERCISES } from '../data/exercises';

type WorkoutSet = {
  exercise: string;
  set_number: number;
  reps: number;
  weight: number;
  day: string;
  type: string;
};

export default function AddWorkoutForm() {
  const [sets, setSets] = useState<WorkoutSet[]>([]);
  const [selectedDay, setSelectedDay] = useState('');
  const [currentExercise, setCurrentExercise] = useState('');
  const [currentReps, setCurrentReps] = useState('');
  const [currentWeight, setCurrentWeight] = useState('');
  const [selectedExercise, setSelectedExercise] = useState('');

  const getDayExercises = () => {
    return EXERCISES.find(d => d.day === selectedDay)?.exercises || [];
  };

  const getWorkoutType = () => {
    return EXERCISES.find(d => d.day === selectedDay)?.type || '';
  };

  const addSet = () => {
    if (selectedDay && currentExercise && currentReps && currentWeight) {
      const newSet: WorkoutSet = {
        day: selectedDay,
        type: getWorkoutType(),
        exercise: currentExercise,
        set_number: sets.filter(s => s.exercise === currentExercise).length + 1,
        reps: parseInt(currentReps),
        weight: parseFloat(currentWeight)
      };
      setSets([...sets, newSet]);
      setCurrentExercise('');
      setCurrentReps('');
      setCurrentWeight('');
    }
  };

// Change the submitWorkout function to:
const submitWorkout = async () => {
  try {
    const setsWithDate = sets.map(set => ({
      ...set,
      date: new Date().toISOString()
    }));
    
    await axios.post('http://localhost:8000/api/workouts/', setsWithDate, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    // Reset form
    setSets([]);
    setSelectedDay('');
    setCurrentExercise('');
    setCurrentReps('');
    setCurrentWeight('');
    
    alert('Workout saved successfully!');
  } catch (error) {
    console.error('Error saving workout:', error);
    alert('Error saving workout - check console for details');
  }
};

  return (
    <div className="workout-form">
      {/* Day Selection */}
      <select
        value={selectedDay}
        onChange={(e) => setSelectedDay(e.target.value)}
      >
        <option value="">Select Day</option>
        {EXERCISES.map((dayGroup) => (
          <option key={dayGroup.day} value={dayGroup.day}>
            {dayGroup.day} - {dayGroup.type}
          </option>
        ))}
      </select>

      {/* Exercise Selection */}
      <select
        value={currentExercise}
        onChange={(e) => setCurrentExercise(e.target.value)}
        disabled={!selectedDay}
      >
        <option value="">Select Exercise</option>
        {getDayExercises().map((exercise) => (
          <option key={exercise} value={exercise}>
            {exercise}
          </option>
        ))}
      </select>

      {/* Reps/Weight Inputs */}
      <input
        type="number"
        placeholder="Reps"
        value={currentReps}
        onChange={(e) => setCurrentReps(e.target.value)}
        disabled={!currentExercise}
      />
      
      <input
        type="number"
        placeholder="Weight (lbs)"
        value={currentWeight}
        onChange={(e) => setCurrentWeight(e.target.value)}
        disabled={!currentExercise}
      />

      <button 
        onClick={addSet}
        disabled={!currentExercise || !currentReps || !currentWeight}
      >
        Add Set
      </button>

      {/* Sets Preview */}
      <div className="sets-preview">
        {sets.map((set, index) => (
          <div key={index}>
            {set.day} - {set.exercise} (Set {set.set_number}): 
            {set.reps} reps @ {set.weight}lbs
          </div>
        ))}
      </div>

      <button 
        onClick={submitWorkout}
        disabled={sets.length === 0}
      >
        Save Workout
      </button>
    </div>
  );
}