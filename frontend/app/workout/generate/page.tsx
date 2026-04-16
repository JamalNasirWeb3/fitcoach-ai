"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { api } from "@/lib/api";
import { getWorkoutImages, Gender } from "@/lib/images";

export default function GenerateWorkoutPage() {
  const router = useRouter();
  const [durationWeeks, setDurationWeeks] = useState(4);
  const [sessionsPerWeek, setSessionsPerWeek] = useState(3);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [gender, setGender] = useState<Gender>(null);

  useEffect(() => {
    api.getMe().then((u) => setGender(u.gender as Gender)).catch(() => {});
  }, []);

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

  const imgs = getWorkoutImages(gender);

  return (
    <main className="min-h-screen bg-gray-950 text-white">

      {/* Header image */}
      <div className="relative h-56 overflow-hidden">
        <Image
          src={imgs.generate}
          alt="Workout"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950/60 to-gray-950" />
        <div className="absolute inset-0 flex flex-col justify-end px-6 sm:px-8 pb-6">
          <Link href="/dashboard" className="text-sm text-emerald-400 hover:text-emerald-300 mb-2">← Dashboard</Link>
          <h1 className="text-3xl font-black">Generate Workout Plan</h1>
          <p className="text-gray-400 text-sm mt-1">AI will build your personalized training program</p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-6">

            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-medium text-gray-300">Program Duration</label>
                <span className="text-emerald-400 font-bold text-sm bg-emerald-500/10 px-3 py-1 rounded-full">{durationWeeks} weeks</span>
              </div>
              <input type="range" min={2} max={12} value={durationWeeks}
                onChange={(e) => setDurationWeeks(Number(e.target.value))}
                className="w-full accent-emerald-500 h-2 rounded-lg appearance-none cursor-pointer bg-gray-700" />
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>2 weeks</span><span>12 weeks</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-medium text-gray-300">Sessions per Week</label>
                <span className="text-emerald-400 font-bold text-sm bg-emerald-500/10 px-3 py-1 rounded-full">{sessionsPerWeek}x / week</span>
              </div>
              <input type="range" min={2} max={6} value={sessionsPerWeek}
                onChange={(e) => setSessionsPerWeek(Number(e.target.value))}
                className="w-full accent-emerald-500 h-2 rounded-lg appearance-none cursor-pointer bg-gray-700" />
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>2 days</span><span>6 days</span>
              </div>
            </div>

          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Additional Notes <span className="text-gray-600 font-normal">(optional)</span>
            </label>
            <textarea rows={3}
              placeholder="e.g. no equipment, focus on upper body, recovering from knee injury"
              value={notes} onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none transition" />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <button type="submit" disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-white py-4 rounded-xl font-bold text-lg transition shadow-lg shadow-emerald-500/20 disabled:opacity-50">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating your plan...
              </span>
            ) : "Generate Workout Plan"}
          </button>
        </form>
      </div>
    </main>
  );
}
