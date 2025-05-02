"use client";  // Add if using client-side features

import AddWorkoutForm from '@/components/AddWorkoutForm'
import WorkoutList from '@/components/WorkoutList'

export default function Home() {
  return (
    <main className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Gym Tracker</h1>
      <AddWorkoutForm />
      <WorkoutList />
    </main>
  )
}