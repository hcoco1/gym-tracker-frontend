"use client"

import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { EXERCISES } from "@/data/exercises"

interface Workout {
  id: number
  exercise: string
  sets: number
  reps: number
  weight?: number
  duration?: number
  notes?: string
  date: string
}

export default function WorkoutList() {
  const { data: workouts, isLoading, isError } = useQuery<Workout[]>({
    queryKey: ["workouts"],
    queryFn: async () => {
      const response = await axios.get("http://localhost:8000/workouts/")
      return response.data
    }
  })

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error loading workouts</div>

  return (
    <div className="space-y-4 p-4">
      {workouts?.map((workout) => {
        const exerciseGroup = EXERCISES.find(g => 
          g.exercises.includes(workout.exercise)
        )
        
        return (
          <div key={workout.id} className="p-4 border rounded-lg shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-lg font-semibold">{workout.exercise}</h3>
                <p className="text-sm text-gray-500">
                  {exerciseGroup?.type || "Custom Exercise"}
                </p>
              </div>
              <span className="text-sm text-gray-500">
                {new Date(workout.date).toLocaleDateString()}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <p>Sets: {workout.sets}</p>
              <p>Reps: {workout.reps}</p>
              {workout.weight && <p>Weight: {workout.weight}kg</p>}
              {workout.duration && <p>Duration: {workout.duration} mins</p>}
            </div>

            {workout.notes && (
              <div className="mt-2 p-2 bg-gray-50 rounded">
                <p className="text-sm text-gray-600">{workout.notes}</p>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}