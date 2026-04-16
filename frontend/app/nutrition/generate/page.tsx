"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { api } from "@/lib/api";

export default function GenerateMealPlanPage() {
  const router = useRouter();
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const plan = await api.generateMealPlan({ additional_notes: notes || undefined });
      router.push(`/nutrition/${plan.id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white">

      {/* Header image */}
      <div className="relative h-56 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1400&q=80&fit=crop&auto=format"
          alt="Healthy meal prep"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950/60 to-gray-950" />
        <div className="absolute inset-0 flex flex-col justify-end px-6 sm:px-8 pb-6">
          <Link href="/dashboard" className="text-sm text-blue-400 hover:text-blue-300 mb-2">← Dashboard</Link>
          <h1 className="text-3xl font-black">Generate Meal Plan</h1>
          <p className="text-gray-400 text-sm mt-1">A 7-day AI nutrition plan tailored to your goals</p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Info cards */}
          <div className="grid grid-cols-3 gap-3">
            {[["7 Days", "Full week covered"], ["Macros", "Protein, carbs & fat"], ["PDF", "Email delivery"]].map(([title, sub]) => (
              <div key={title} className="bg-gray-900 border border-gray-800 rounded-xl p-3 text-center">
                <p className="text-sm font-bold text-blue-400">{title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{sub}</p>
              </div>
            ))}
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Additional Notes <span className="text-gray-600 font-normal">(optional)</span>
            </label>
            <textarea rows={4}
              placeholder="e.g. prefer high protein breakfast, no fish, budget-friendly meals, Mediterranean style"
              value={notes} onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition" />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <button type="submit" disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl font-bold text-lg transition shadow-lg shadow-blue-500/20 disabled:opacity-50">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating your meal plan...
              </span>
            ) : "Generate Meal Plan"}
          </button>
        </form>
      </div>
    </main>
  );
}
