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
    <div className="mt-8 space-y-8 px-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Training Sessions</h2>

      {Object.entries(groupedWorkouts).map(([date, exercises]) => (
        <div key={date} className="space-y-4">
          {/* Date Parent Card */}
          <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              {date}
            </h3>

            {/* Exercise Cards */}
            {Object.entries(exercises).map(([exercise, sets]) => (
              <div key={exercise} className="mb-6 last:mb-0">
                <div className="bg-gray-50 p-4 md:p-5 rounded-lg">
                  {/* Exercise Header */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
                    <h4 className="text-md font-semibold text-gray-800">{exercise}</h4>
                    <span className="text-sm text-gray-600 bg-gray-200 px-3 py-1 rounded-full">
                      {sets[0].type}
                    </span>
                  </div>

                  {/* Sets List */}
                  <div className="space-y-3">
                    {sets.map((set) => (
                      <div
                        key={set.id}
                        className="p-3 bg-white rounded-lg border border-gray-200 flex justify-between items-center transition-colors hover:border-gray-300"
                      >
                        <div className="flex-1">
                          <div className="flex flex-wrap gap-x-4 gap-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-800">Set {set.set_number}</span>
                              <span className="text-gray-400">|</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-gray-600">Reps:</span>
                              <span className="font-medium text-gray-800">{set.reps}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-gray-600">Weight:</span>
                              <span className="font-medium text-gray-800">{set.weight} lbs</span>
                            </div>
                          </div>
                        </div>
                        
                        {set.id && (
                          <button
                            onClick={() => handleDelete(set.id!)}
                            className="ml-4 text-red-500 hover:text-red-700 transition-colors"
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