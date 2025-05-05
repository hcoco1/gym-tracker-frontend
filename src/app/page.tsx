import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to GymTracker
          </h1>
          <p className="text-gray-600 mb-8">
            Track your workouts, monitor your progress, and achieve your fitness goals
          </p>
          
          <div className="flex flex-col space-y-4">
            <Link
              href="/login"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors text-center"
            >
              Login
            </Link>
            
            <Link
              href="/register"
              className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors text-center"
            >
              Create New Account
            </Link>
          </div>

          <div className="mt-8">
            <p className="text-gray-500 text-sm">
              Get started in seconds. No credit card required.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}