"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api, AdminUserSummary } from "@/lib/api";

export default function AdminPage() {
  const router = useRouter();
  const [users, setUsers] = useState<AdminUserSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }

    api.adminListUsers()
      .then(setUsers)
      .catch((err: Error) => {
        if (err.message.includes("401")) { router.push("/login"); return; }
        setError(err.message.includes("403") ? "Access denied. Admin only." : "Failed to load users.");
      })
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">Loading...</div>;

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
      <div className="text-center">
        <p className="text-red-400 text-xl font-bold mb-2">{error}</p>
        <Link href="/dashboard" className="text-emerald-400 text-sm hover:underline">Back to Dashboard</Link>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <nav className="flex justify-between items-center px-8 py-5 border-b border-gray-800">
        <span className="text-xl font-black text-emerald-400">FitCoach AI — Admin</span>
        <Link href="/dashboard" className="text-sm text-gray-400 hover:text-white transition">
          ← Back to Dashboard
        </Link>
      </nav>

      <div className="max-w-6xl mx-auto p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black">Registered Users</h1>
            <p className="text-gray-400 text-sm mt-1">{users.length} total users</p>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800 text-left text-xs text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Goal</th>
                <th className="px-6 py-4">Weight</th>
                <th className="px-6 py-4 text-center">Workouts</th>
                <th className="px-6 py-4 text-center">Meal Plans</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-800/50 transition">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-white">{user.full_name}</p>
                    <p className="text-sm text-gray-400">{user.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    {user.fitness_goal ? (
                      <span className="text-xs font-medium bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-full capitalize">
                        {user.fitness_goal.replace(/_/g, " ")}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-600">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-300 text-sm">
                    {user.weight_kg ? `${user.weight_kg} kg` : "—"}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-sm font-bold ${user.workout_count > 0 ? "text-emerald-400" : "text-gray-600"}`}>
                      {user.workout_count}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-sm font-bold ${user.meal_count > 0 ? "text-blue-400" : "text-gray-600"}`}>
                      {user.meal_count}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/users/${user.id}`}
                      className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition"
                    >
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <p className="text-center text-gray-600 py-12">No users registered yet.</p>
          )}
        </div>
      </div>
    </main>
  );
}
