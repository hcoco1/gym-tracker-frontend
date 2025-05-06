"use client";
import axios from "axios";
import { api, authHeaders } from "../lib/api";
import type { WorkoutSet } from "../components/AddWorkoutForm";
import { useAuth } from "../hooks/useAuth";

interface WorkoutCardsProps {
  workouts: WorkoutSet[];
  onDelete: (setId: number) => void;
}

const WorkoutCards = ({ workouts, onDelete }: WorkoutCardsProps) => {
  const { token } = useAuth();

  const handleDelete = async (setId: number) => {
    try {
      await axios.delete(api.workouts.delete(setId), authHeaders(token!));
      onDelete(setId);
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  // Group workouts by date with proper formatting
  const groupedWorkouts = workouts.reduce((acc, workout) => {
    const date = workout.date
      ? new Date(workout.date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "Unknown Date";

    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(workout);
    return acc;
  }, {} as Record<string, WorkoutSet[]>);

  return (
    <div className="mt-8 space-y-8">
      <h2 className="text-xl font-semibold mb-4">Training Sessions</h2>

      {Object.entries(groupedWorkouts).map(([date, dateWorkouts]) => (
        <div key={date} className="space-y-4">
          {/* Date Header */}
          <h3 className="text-lg font-semibold capitalize border-b pb-2">
            {date}
          </h3>

          {/* Individual Cards */}
          <div className="grid gap-4">
            {dateWorkouts.map((workout) => (
              <div
                key={workout.id}
                className="p-4 bg-white rounded-lg border shadow-sm relative hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium text-lg">{workout.exercise}</h3>
                    <p className="text-sm text-gray-500">
                      {workout.type} {/* Removed day from here */}
                    </p>
                  </div>
                  <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded">
                    Set #{workout.set_number}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">Reps:</span> {workout.reps}
                  </div>
                  <div>
                    <span className="text-gray-500">Weight:</span>{" "}
                    {workout.weight} lbs
                  </div>
                </div>

                {workout.id && (
                  <button
                    onClick={() => handleDelete(workout.id!)}
                    className="absolute bottom-2 right-2 text-red-500 hover:text-red-700 transition-colors"
                    title="Delete set"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {workouts.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No workouts logged yet. Add your first set!
        </div>
      )}
    </div>
  );
};

export default WorkoutCards;
