'use client'

import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

interface Workout {
  id: number
  exercise: string
  sets: number
  reps: number
  workout_date: string
}

export default function WorkoutList() {
  const { data: workouts, isLoading, isError } = useQuery<Workout[]>({
    queryKey: ['workouts'],
    queryFn: async () => {
      const response = await axios.get('http://localhost:8000/workouts/')
      return response.data
    }
  })

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error loading workouts</div>

  return (
    <div className="space-y-2">
      {workouts?.map((workout) => (
        <div key={workout.id} className="p-3 border rounded">
          <h3 className="font-bold">{workout.exercise}</h3>
          <p>Sets: {workout.sets} | Reps: {workout.reps}</p>
          <p className="text-sm text-gray-500">
            {new Date(workout.workout_date).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  )
}