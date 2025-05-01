import AddWorkoutForm from '@/components/AddWorkoutForm'
import WorkoutList from '@/components/WorkoutList'

export default function Home() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Gym Tracker</h1>
      <AddWorkoutForm />
      <WorkoutList />
    </div>
  )
}