'use client'

import { useState } from 'react'
import axios from 'axios'
import { useQueryClient } from '@tanstack/react-query'

export default function AddWorkoutForm() {
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState({
    exercise: '',
    sets: '',
    reps: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await axios.post('http://localhost:8000/workouts/', {
        exercise: formData.exercise,
        sets: Number(formData.sets),
        reps: Number(formData.reps)
      })
      queryClient.invalidateQueries({ queryKey: ['workouts'] })
      setFormData({ exercise: '', sets: '', reps: '' })
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded mb-6">
      <input
        type="text"
        placeholder="Exercise"
        value={formData.exercise}
        onChange={(e) => setFormData({ ...formData, exercise: e.target.value })}
        className="w-full p-2 border rounded"
      />
      <input
        type="number"
        placeholder="Sets"
        value={formData.sets}
        onChange={(e) => setFormData({ ...formData, sets: e.target.value })}
        className="w-full p-2 border rounded"
      />
      <input
        type="number"
        placeholder="Reps"
        value={formData.reps}
        onChange={(e) => setFormData({ ...formData, reps: e.target.value })}
        className="w-full p-2 border rounded"
      />
      <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
        Add Workout
      </button>
    </form>
  )
}