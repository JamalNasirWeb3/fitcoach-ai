"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
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

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!plan) return null;

  const planData = plan.plan_data as { weeks: Week[] };

  return (
    <main className="min-h-screen bg-gray-950 text-white">

      {/* Header image */}
      <div className="relative h-52 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1400&q=80&fit=crop&auto=format"
          alt="Gym"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950/50 to-gray-950" />
        <div className="absolute inset-0 flex flex-col justify-end px-4 sm:px-6 pb-6 max-w-3xl mx-auto w-full">
          <Link href="/dashboard" className="text-sm text-emerald-400 hover:text-emerald-300 mb-2">← Dashboard</Link>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black">{plan.title}</h1>
              <p className="text-gray-400 text-sm mt-1">{plan.duration_weeks} weeks · {plan.sessions_per_week} sessions/week</p>
            </div>
            <button onClick={handleEmail} disabled={sending || sent}
              className="bg-emerald-500 hover:bg-emerald-400 text-white px-5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50 transition w-full sm:w-auto shrink-0">
              {sent ? "✓ Sent!" : sending ? "Sending..." : "Email PDF"}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-5">
        {planData.weeks?.map((week) => (
          <div key={week.week} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            <div className="bg-emerald-500/10 border-b border-gray-800 px-5 py-3">
              <h2 className="font-bold text-emerald-400">Week {week.week}</h2>
            </div>
            <div className="divide-y divide-gray-800">
              {week.sessions?.map((session, i) => (
                <div key={i} className="p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="font-bold text-white">{session.day}</span>
                    <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">{session.focus}</span>
                  </div>

                  {/* Desktop table */}
                  <div className="hidden sm:block">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-gray-500 text-xs border-b border-gray-800">
                          <th className="text-left pb-2 font-medium">Exercise</th>
                          <th className="text-center pb-2 font-medium w-16">Sets</th>
                          <th className="text-center pb-2 font-medium w-16">Reps</th>
                          <th className="text-center pb-2 font-medium w-16">Rest</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-800/50">
                        {session.exercises?.map((ex, j) => (
                          <tr key={j}>
                            <td className="py-2.5 text-gray-200">
                              {ex.name}
                              {ex.notes && <span className="text-gray-500 text-xs ml-2">({ex.notes})</span>}
                            </td>
                            <td className="text-center text-gray-300">{ex.sets}</td>
                            <td className="text-center text-gray-300">{ex.reps}</td>
                            <td className="text-center text-gray-500 text-xs">{ex.rest_seconds}s</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile cards */}
                  <div className="sm:hidden space-y-2">
                    {session.exercises?.map((ex, j) => (
                      <div key={j} className="bg-gray-800 rounded-xl px-4 py-3">
                        <p className="text-sm font-medium text-white">
                          {ex.name}
                          {ex.notes && <span className="text-gray-500 text-xs ml-2">({ex.notes})</span>}
                        </p>
                        <div className="flex gap-3 mt-1.5 text-xs text-gray-400">
                          <span className="bg-gray-700 px-2 py-0.5 rounded">{ex.sets} sets</span>
                          <span className="bg-gray-700 px-2 py-0.5 rounded">{ex.reps} reps</span>
                          <span className="bg-gray-700 px-2 py-0.5 rounded">{ex.rest_seconds}s rest</span>
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
