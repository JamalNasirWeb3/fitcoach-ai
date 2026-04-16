"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api, UserProfile, WorkoutPlan, MealPlan } from "@/lib/api";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [workouts, setWorkouts] = useState<WorkoutPlan[]>([]);
  const [meals, setMeals] = useState<MealPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }

    Promise.all([api.getMe(), api.listWorkouts(), api.listMealPlans()])
      .then(([u, w, m]) => { setUser(u); setWorkouts(w); setMeals(m); })
      .catch(() => { localStorage.removeItem("token"); router.push("/login"); })
      .finally(() => setLoading(false));
  }, [router]);

  function logout() {
    localStorage.removeItem("token");
    router.push("/");
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <span className="text-xl font-bold text-emerald-700">FitCoach AI</span>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">{user?.full_name}</span>
          <Link href="/onboarding" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium transition">Edit Profile</Link>
          <button onClick={logout} className="text-sm text-gray-500 hover:text-red-500 transition">Logout</button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Welcome back, {user?.full_name?.split(" ")[0]}!</h1>
          <p className="text-gray-500 text-sm mt-1">
            Goal: <span className="font-medium capitalize">{user?.fitness_goal?.replace(/_/g, " ")}</span>
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Link href="/workout/generate"
            className="bg-emerald-600 text-white rounded-xl p-6 hover:bg-emerald-700 transition">
            <h2 className="text-lg font-semibold">Generate Workout Plan</h2>
            <p className="text-emerald-100 text-sm mt-1">AI-personalized training program</p>
          </Link>
          <Link href="/nutrition/generate"
            className="bg-blue-600 text-white rounded-xl p-6 hover:bg-blue-700 transition">
            <h2 className="text-lg font-semibold">Generate Meal Plan</h2>
            <p className="text-blue-100 text-sm mt-1">AI-personalized nutrition plan</p>
          </Link>
        </div>

        {/* Workout Plans */}
        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">Your Workout Plans</h2>
          {workouts.length === 0 ? (
            <p className="text-gray-400 text-sm">No workout plans yet. Generate your first one above.</p>
          ) : (
            <div className="space-y-3">
              {workouts.map((w) => (
                <Link key={w.id} href={`/workout/${w.id}`}
                  className="block bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition border border-gray-100">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-800">{w.title}</p>
                      <p className="text-sm text-gray-500">{w.duration_weeks} weeks · {w.sessions_per_week} sessions/week</p>
                    </div>
                    <span className="text-xs text-gray-400">{new Date(w.created_at).toLocaleDateString()}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Meal Plans */}
        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">Your Meal Plans</h2>
          {meals.length === 0 ? (
            <p className="text-gray-400 text-sm">No meal plans yet. Generate your first one above.</p>
          ) : (
            <div className="space-y-3">
              {meals.map((m) => (
                <Link key={m.id} href={`/nutrition/${m.id}`}
                  className="block bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition border border-gray-100">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-800">{m.title}</p>
                      <p className="text-sm text-gray-500">
                        {m.daily_calories} kcal/day · P: {m.protein_g}g · C: {m.carbs_g}g · F: {m.fat_g}g
                      </p>
                    </div>
                    <span className="text-xs text-gray-400">{new Date(m.created_at).toLocaleDateString()}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
