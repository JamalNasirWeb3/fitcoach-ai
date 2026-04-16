"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { api, WorkoutPlan } from "@/lib/api";

interface Exercise { name: string; sets: number; reps: string; rest_seconds: number; notes?: string; }
interface Session { day: string; focus: string; exercises: Exercise[]; }
interface Week { week: number; sessions: Session[]; }

export default function WorkoutPlanPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [plan, setPlan] = useState<WorkoutPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleEmail() {
    setSending(true);
    try {
      await api.emailWorkoutPlan(Number(id));
      setSent(true);
    } finally {
      setSending(false);
    }
  }

  useEffect(() => {
    api.listWorkouts()
      .then((plans) => {
        const found = plans.find((p) => p.id === Number(id));
        if (!found) router.push("/dashboard");
        else setPlan(found);
      })
      .catch(() => router.push("/login"))
      .finally(() => setLoading(false));
  }, [id, router]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!plan) return null;

  const planData = plan.plan_data as { weeks: Week[] };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <Link href="/dashboard" className="text-sm text-emerald-600 hover:underline">← Dashboard</Link>
            <h1 className="text-2xl font-bold text-gray-800 mt-1">{plan.title}</h1>
            <p className="text-sm text-gray-500">{plan.duration_weeks} weeks · {plan.sessions_per_week} sessions/week</p>
          </div>
          <button onClick={handleEmail} disabled={sending || sent}
            className="sm:mt-6 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-700 disabled:opacity-50 transition w-full sm:w-auto">
            {sent ? "Sent!" : sending ? "Sending..." : "Email PDF"}
          </button>
        </div>

        {planData.weeks?.map((week) => (
          <div key={week.week} className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="bg-emerald-50 px-5 py-3 rounded-t-xl">
              <h2 className="font-bold text-emerald-800">Week {week.week}</h2>
            </div>
            <div className="divide-y">
              {week.sessions?.map((session, i) => (
                <div key={i} className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="font-semibold text-gray-800">{session.day}</span>
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">{session.focus}</span>
                  </div>
                  {/* Desktop table */}
                  <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-gray-400 text-xs">
                          <th className="text-left pb-1">Exercise</th>
                          <th className="text-center pb-1">Sets</th>
                          <th className="text-center pb-1">Reps</th>
                          <th className="text-center pb-1">Rest</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {session.exercises?.map((ex, j) => (
                          <tr key={j}>
                            <td className="py-1.5 text-gray-700">{ex.name}{ex.notes && <span className="text-gray-400 text-xs ml-1">({ex.notes})</span>}</td>
                            <td className="text-center text-gray-600">{ex.sets}</td>
                            <td className="text-center text-gray-600">{ex.reps}</td>
                            <td className="text-center text-gray-500">{ex.rest_seconds}s</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {/* Mobile cards */}
                  <div className="sm:hidden space-y-2">
                    {session.exercises?.map((ex, j) => (
                      <div key={j} className="bg-gray-50 rounded-lg px-3 py-2">
                        <p className="text-sm font-medium text-gray-800">{ex.name}{ex.notes && <span className="text-gray-400 text-xs ml-1">({ex.notes})</span>}</p>
                        <div className="flex gap-3 mt-1 text-xs text-gray-500">
                          <span>{ex.sets} sets</span>
                          <span>{ex.reps} reps</span>
                          <span>{ex.rest_seconds}s rest</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
