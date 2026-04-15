"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function GenerateWorkoutPage() {
  const router = useRouter();
  const [durationWeeks, setDurationWeeks] = useState(4);
  const [sessionsPerWeek, setSessionsPerWeek] = useState(3);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const plan = await api.generateWorkout({
        duration_weeks: durationWeeks,
        sessions_per_week: sessionsPerWeek,
        additional_notes: notes || undefined,
      });
      router.push(`/workout/${plan.id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-md space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Generate Workout Plan</h1>
          <p className="text-gray-500 text-sm mt-1">Our AI will build a plan based on your profile.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration: <span className="text-emerald-600 font-semibold">{durationWeeks} weeks</span>
            </label>
            <input type="range" min={2} max={12} value={durationWeeks}
              onChange={(e) => setDurationWeeks(Number(e.target.value))}
              className="w-full accent-emerald-600" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sessions per week: <span className="text-emerald-600 font-semibold">{sessionsPerWeek}</span>
            </label>
            <input type="range" min={2} max={6} value={sessionsPerWeek}
              onChange={(e) => setSessionsPerWeek(Number(e.target.value))}
              className="w-full accent-emerald-600" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Notes <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea rows={3} placeholder="e.g. no equipment, focus on upper body, recovering from knee injury"
              value={notes} onChange={(e) => setNotes(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none" />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 disabled:opacity-50 transition">
            {loading ? "Generating your plan..." : "Generate Plan"}
          </button>
        </form>
      </div>
    </main>
  );
}
