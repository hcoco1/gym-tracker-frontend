"use client";

import { useState } from 'react';
import axios from 'axios';
import { useQueryClient } from '@tanstack/react-query';
import { EXERCISES } from '@/data/exercises';

interface WorkoutForm {
  exercise: string
  sets: string
  reps: string
  weight: string  // Changed from optional to required
  duration: string
  notes: string
}

export default function AddWorkoutForm() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<WorkoutForm>({
    exercise: '',
    sets: '',
    reps: '',
    weight: '',       // Initialize with empty string
    duration: '',     // Initialize with empty string
    notes: ''         // Initialize with empty string
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/workouts/', {
        exercise: formData.exercise,
        sets: Number(formData.sets),
        reps: Number(formData.reps),
        weight: formData.weight ? Number(formData.weight) : null,
        duration: formData.duration ? Number(formData.duration) : null,
        notes: formData.notes,
        date: new Date().toISOString()
      });
      queryClient.invalidateQueries({ queryKey: ['workouts'] });
      setFormData({
        exercise: '',
        sets: '',
        reps: '',
        weight: '',
        duration: '',
        notes: ''
      });
    } catch (error) {
      console.error('Error submitting workout:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded mb-6">
      {/* Exercise Dropdown */}
      <select
        value={formData.exercise}
        onChange={(e) => setFormData({...formData, exercise: e.target.value})}
        className="w-full p-2 border rounded"
        required
      >
        <option value="">Select Exercise</option>
        {EXERCISES.map((group) => (
          <optgroup key={group.day} label={`${group.day} - ${group.type}`}>
            {group.exercises.map((exercise) => (
              <option key={exercise} value={exercise}>{exercise}</option>
            ))}
          </optgroup>
        ))}
      </select>

      {/* Sets/Reps/Weight/Duration Grid */}
      <div className="grid grid-cols-2 gap-4">
        <input
          type="number"
          placeholder="Sets"
          value={formData.sets}
          onChange={(e) => setFormData({...formData, sets: e.target.value})}
          className="p-2 border rounded"
          required
        />
        <input
          type="number"
          placeholder="Reps"
          value={formData.reps}
          onChange={(e) => setFormData({...formData, reps: e.target.value})}
          className="p-2 border rounded"
          required
        />
        <input
          type="number"
          placeholder="Weight (kg)"
          value={formData.weight}
          onChange={(e) => setFormData({...formData, weight: e.target.value})}
          className="p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Duration (minutes)"
          value={formData.duration}
          onChange={(e) => setFormData({...formData, duration: e.target.value})}
          className="p-2 border rounded"
        />
      </div>

      {/* Notes */}
      <textarea
        placeholder="Workout notes"
        value={formData.notes}
        onChange={(e) => setFormData({...formData, notes: e.target.value})}
        className="w-full p-2 border rounded"
        rows={3}
      />

      <button 
        type="submit" 
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Add Workout
      </button>
    </form>
  )
}