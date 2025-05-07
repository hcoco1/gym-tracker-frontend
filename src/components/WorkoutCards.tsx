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

  // Group by date -> exercise -> sets
  const groupedWorkouts = workouts.reduce((acc, workout) => {
    const date = workout.date
      ? new Date(workout.date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "Unknown Date";

    if (!acc[date]) {
      acc[date] = {};
    }
    
    if (!acc[date][workout.exercise]) {
      acc[date][workout.exercise] = [];
    }
    
    acc[date][workout.exercise].push(workout);
    return acc;
  }, {} as Record<string, Record<string, WorkoutSet[]>>);

  return (
    <div className="mt-8 space-y-8">
      <h2 className="text-xl font-semibold mb-4">Training Sessions</h2>

      {Object.entries(groupedWorkouts).map(([date, exercises]) => (
        <div key={date} className="space-y-4">
          {/* Date Parent Card */}
          <div className="bg-gray-50 p-4 rounded-lg border shadow-sm">
            <h3 className="text-lg font-semibold border-b pb-2 mb-4">
              {date}
            </h3>

            {/* Exercise Cards */}
            {Object.entries(exercises).map(([exercise, sets]) => (
              <div key={exercise} className="mb-6 last:mb-0">
                <div className="bg-white p-4 rounded-lg border shadow-sm">
                  {/* Exercise Header */}
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-medium">{exercise}</h4>
                    <span className="text-sm text-gray-500">
                      {sets[0].type} {/* Type from first set */}
                    </span>
                  </div>

                  {/* Sets List */}
                  <div className="space-y-3">
                    {sets.map((set) => (
                      <div
                        key={set.id}
                        className="p-3 bg-gray-50 rounded-md relative group"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="font-medium">Set #{set.set_number}</span>
                            <div className="flex gap-4 mt-1">
                              <span className="text-sm">
                                <span className="text-gray-500">Reps:</span> {set.reps}
                              </span>
                              <span className="text-sm">
                                <span className="text-gray-500">Weight:</span> {set.weight} lbs
                              </span>
                            </div>
                          </div>
                          {set.id && (
                            <button
                              onClick={() => handleDelete(set.id!)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700"
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
                      </div>
                    ))}
                  </div>
                </div>
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