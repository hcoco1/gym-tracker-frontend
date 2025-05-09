"use client";
import AddWorkoutForm from '@/components/AddWorkoutForm';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { token, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push('/login');
    }
  }, [token, router]);

  if (!token) return null;

  return (
    <main className="max-w-2xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Workouts</h1>
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-300 text-white rounded hover:bg-red-800 transition-colors"
        >
          Logout
        </button>
      </div>
      <AddWorkoutForm />
    </main>
  );
}