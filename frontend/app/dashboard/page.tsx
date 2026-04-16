"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { api, UserProfile, WorkoutPlan, MealPlan } from "@/lib/api";
import { getWorkoutImages } from "@/lib/images";

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

  const imgs = getWorkoutImages(user?.gender as never);

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <main className="min-h-screen bg-gray-950 text-white">

      {/* Nav */}
      <nav className="bg-gray-900 border-b border-gray-800 px-4 sm:px-6 py-4 flex justify-between items-center gap-3">
        <span className="text-lg sm:text-xl font-black text-emerald-400 shrink-0">FitCoach AI</span>
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <span className="text-sm text-gray-400 truncate hidden sm:block">{user?.full_name}</span>
          <Link href="/onboarding" className="text-sm text-emerald-400 hover:text-emerald-300 font-medium transition shrink-0">Edit Profile</Link>
          <button onClick={logout} className="text-sm text-gray-500 hover:text-red-400 transition shrink-0">Logout</button>
        </div>
      </nav>

      {/* Hero banner */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={imgs.banner}
          alt="Training"
          fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950/90 via-gray-950/60 to-transparent" />
        <div className="absolute inset-0 flex items-center px-6 sm:px-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black">
              Welcome back, {user?.full_name?.split(" ")[0]}!
            </h1>
            {user?.fitness_goal && (
              <p className="text-emerald-400 text-sm mt-1 font-medium capitalize">
                Goal: {user.fitness_goal.replace(/_/g, " ")}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-8">

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/workout/generate" className="relative rounded-2xl overflow-hidden group h-36">
            <Image
              src={imgs.card}
              alt="Workout"
              fill
              className="object-cover group-hover:scale-105 transition duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-5">
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">AI-Powered</span>
              <h2 className="text-lg font-bold text-white">Generate Workout Plan</h2>
            </div>
          </Link>
          <Link href="/nutrition/generate" className="relative rounded-2xl overflow-hidden group h-36">
            <Image
              src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80&fit=crop&auto=format"
              alt="Nutrition"
              fill
              className="object-cover group-hover:scale-105 transition duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-5">
              <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">AI-Powered</span>
              <h2 className="text-lg font-bold text-white">Generate Meal Plan</h2>
            </div>
          </Link>
        </div>

        {/* Workout Plans */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
              Workout Plans
            </h2>
            <span className="text-xs text-gray-500">{workouts.length} plan{workouts.length !== 1 ? "s" : ""}</span>
          </div>
          {workouts.length === 0 ? (
            <div className="bg-gray-900 border border-gray-800 border-dashed rounded-2xl p-8 text-center">
              <p className="text-gray-500 text-sm">No workout plans yet.</p>
              <Link href="/workout/generate" className="text-emerald-400 text-sm hover:underline mt-1 inline-block">Generate your first plan →</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {workouts.map((w) => (
                <Link key={w.id} href={`/workout/${w.id}`}
                  className="flex justify-between items-center bg-gray-900 border border-gray-800 hover:border-emerald-800 rounded-xl p-4 transition group">
                  <div>
                    <p className="font-semibold text-white group-hover:text-emerald-300 transition">{w.title}</p>
                    <p className="text-sm text-gray-500 mt-0.5">{w.duration_weeks} weeks · {w.sessions_per_week} sessions/week</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-600">{new Date(w.created_at).toLocaleDateString()}</span>
                    <p className="text-emerald-500 text-xs mt-1">View →</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Meal Plans */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400 inline-block"></span>
              Meal Plans
            </h2>
            <span className="text-xs text-gray-500">{meals.length} plan{meals.length !== 1 ? "s" : ""}</span>
          </div>
          {meals.length === 0 ? (
            <div className="bg-gray-900 border border-gray-800 border-dashed rounded-2xl p-8 text-center">
              <p className="text-gray-500 text-sm">No meal plans yet.</p>
              <Link href="/nutrition/generate" className="text-blue-400 text-sm hover:underline mt-1 inline-block">Generate your first plan →</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {meals.map((m) => (
                <Link key={m.id} href={`/nutrition/${m.id}`}
                  className="flex justify-between items-center bg-gray-900 border border-gray-800 hover:border-blue-800 rounded-xl p-4 transition group">
                  <div>
                    <p className="font-semibold text-white group-hover:text-blue-300 transition">{m.title}</p>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {m.daily_calories} kcal · P {m.protein_g}g · C {m.carbs_g}g · F {m.fat_g}g
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-600">{new Date(m.created_at).toLocaleDateString()}</span>
                    <p className="text-blue-500 text-xs mt-1">View →</p>
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
