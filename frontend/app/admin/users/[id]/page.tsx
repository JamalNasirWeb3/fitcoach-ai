"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { api, AdminUserDetail } from "@/lib/api";

export default function AdminUserDetailPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<AdminUserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }

    api.adminGetUser(Number(id))
      .then(setUser)
      .catch((err: Error) => {
        if (err.message.includes("401")) { router.push("/login"); return; }
        setError(err.message.includes("403") ? "Access denied. Admin only." : "Failed to load user.");
      })
      .finally(() => setLoading(false));
  }, [id, router]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">Loading...</div>;

  if (error || !user) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
      <div className="text-center">
        <p className="text-red-400 text-xl font-bold mb-2">{error || "User not found"}</p>
        <Link href="/admin" className="text-emerald-400 text-sm hover:underline">← Back to Admin</Link>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <nav className="flex justify-between items-center px-8 py-5 border-b border-gray-800">
        <span className="text-xl font-black text-emerald-400">FitCoach AI — Admin</span>
        <Link href="/admin" className="text-sm text-gray-400 hover:text-white transition">
          ← Back to Users
        </Link>
      </nav>

      <div className="max-w-4xl mx-auto p-8 space-y-8">

        {/* User Profile */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h1 className="text-2xl font-black mb-1">{user.full_name}</h1>
          <p className="text-gray-400 text-sm mb-6">{user.email} · Joined {new Date(user.created_at).toLocaleDateString()}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              ["Goal", user.fitness_goal?.replace(/_/g, " ") || "—"],
              ["Activity", user.activity_level?.replace(/_/g, " ") || "—"],
              ["Weight", user.weight_kg ? `${user.weight_kg} kg` : "—"],
              ["Height", user.height_cm ? `${user.height_cm} cm` : "—"],
              ["Age", user.age ? `${user.age} yrs` : "—"],
              ["Gender", user.gender || "—"],
              ["Dietary", user.dietary_restrictions || "None"],
              ["Plans", `${user.workout_count} workouts · ${user.meal_count} meals`],
            ].map(([label, value]) => (
              <div key={label} className="bg-gray-800 rounded-xl p-4">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{label}</p>
                <p className="text-sm font-semibold capitalize">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Workout Plans */}
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
            Workout Plans
            <span className="text-sm font-normal text-gray-500">({user.workouts.length})</span>
          </h2>
          {user.workouts.length === 0 ? (
            <p className="text-gray-600 text-sm">No workout plans generated yet.</p>
          ) : (
            <div className="space-y-3">
              {user.workouts.map((w) => (
                <div key={w.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{w.title}</p>
                    <p className="text-sm text-gray-400">{w.duration_weeks} weeks · {w.sessions_per_week} sessions/week</p>
                  </div>
                  <span className="text-xs text-gray-500">{new Date(w.created_at).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Meal Plans */}
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-400 inline-block"></span>
            Meal Plans
            <span className="text-sm font-normal text-gray-500">({user.meals.length})</span>
          </h2>
          {user.meals.length === 0 ? (
            <p className="text-gray-600 text-sm">No meal plans generated yet.</p>
          ) : (
            <div className="space-y-3">
              {user.meals.map((m) => (
                <div key={m.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{m.title}</p>
                    {m.daily_calories && (
                      <p className="text-sm text-gray-400">
                        {m.daily_calories} kcal/day · P: {m.protein_g}g · C: {m.carbs_g}g · F: {m.fat_g}g
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">{new Date(m.created_at).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
