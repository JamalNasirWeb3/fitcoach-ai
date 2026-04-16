"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";

const GOALS = [
  { value: "lose_weight", label: "Lose Weight", icon: "🔥" },
  { value: "build_muscle", label: "Build Muscle", icon: "💪" },
  { value: "improve_longevity", label: "Improve Longevity", icon: "🧬" },
  { value: "general_fitness", label: "General Fitness", icon: "⚡" },
];

const ACTIVITY_LEVELS = [
  { value: "sedentary", label: "Sedentary", sub: "Little or no exercise" },
  { value: "lightly_active", label: "Lightly Active", sub: "1–3 days/week" },
  { value: "moderately_active", label: "Moderately Active", sub: "3–5 days/week" },
  { value: "very_active", label: "Very Active", sub: "6–7 days/week" },
];

const inputClass = "w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition";
const labelClass = "block text-sm font-medium text-gray-300 mb-1.5";

export default function OnboardingPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    age: "", weight_kg: "", height_cm: "", gender: "",
    activity_level: "", fitness_goal: "", dietary_restrictions: "",
  });
  const [isEdit, setIsEdit] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }

    api.getMe()
      .then((user) => {
        setIsEdit(!!(user.fitness_goal && user.weight_kg));
        setForm({
          age: user.age?.toString() ?? "",
          weight_kg: user.weight_kg?.toString() ?? "",
          height_cm: user.height_cm?.toString() ?? "",
          gender: user.gender ?? "",
          activity_level: user.activity_level ?? "",
          fitness_goal: user.fitness_goal ?? "",
          dietary_restrictions: user.dietary_restrictions ?? "",
        });
      })
      .catch(() => router.push("/login"))
      .finally(() => setFetching(false));
  }, [router]);

  function set(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.updateProfile({
        age: Number(form.age),
        weight_kg: Number(form.weight_kg),
        height_cm: Number(form.height_cm),
        gender: form.gender,
        activity_level: form.activity_level as never,
        fitness_goal: form.fitness_goal as never,
        dietary_restrictions: form.dietary_restrictions || undefined,
      });
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save profile");
    } finally {
      setLoading(false);
    }
  }

  if (fetching) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <main className="min-h-screen bg-gray-950 text-white py-12 px-4">
      <div className="max-w-lg mx-auto">

        <div className="mb-8">
          <Link href="/" className="text-2xl font-black text-emerald-400 tracking-tight">FitCoach AI</Link>
          <h1 className="text-3xl font-black mt-6 mb-1">
            {isEdit ? "Edit Your Profile" : "Set Up Your Profile"}
          </h1>
          <p className="text-gray-400 text-sm">This helps us personalize your workout and meal plans.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Body stats */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Body Stats</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Age</label>
                <input type="number" value={form.age} onChange={(e) => set("age", e.target.value)} required placeholder="25" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Gender</label>
                <select value={form.gender} onChange={(e) => set("gender", e.target.value)} required className={inputClass}>
                  <option value="" disabled>Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Weight (kg)</label>
                <input type="number" step="0.1" value={form.weight_kg} onChange={(e) => set("weight_kg", e.target.value)} required placeholder="75" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Height (cm)</label>
                <input type="number" value={form.height_cm} onChange={(e) => set("height_cm", e.target.value)} required placeholder="175" className={inputClass} />
              </div>
            </div>
          </div>

          {/* Fitness Goal */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Fitness Goal</h2>
            <div className="grid grid-cols-2 gap-3">
              {GOALS.map((g) => (
                <button type="button" key={g.value} onClick={() => set("fitness_goal", g.value)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium transition text-left ${
                    form.fitness_goal === g.value
                      ? "bg-emerald-500/20 border-emerald-500 text-emerald-300"
                      : "border-gray-700 text-gray-300 hover:border-gray-500"
                  }`}>
                  <span className="text-xl">{g.icon}</span>
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          {/* Activity Level */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Activity Level</h2>
            <div className="space-y-2">
              {ACTIVITY_LEVELS.map((a) => (
                <button type="button" key={a.value} onClick={() => set("activity_level", a.value)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm transition text-left ${
                    form.activity_level === a.value
                      ? "bg-emerald-500/20 border-emerald-500 text-emerald-300"
                      : "border-gray-700 text-gray-300 hover:border-gray-500"
                  }`}>
                  <span className="font-medium">{a.label}</span>
                  <span className="text-xs text-gray-500">{a.sub}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Dietary restrictions */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
              Dietary Restrictions <span className="text-gray-600 normal-case font-normal">(optional)</span>
            </h2>
            <input type="text" placeholder="e.g. vegan, gluten-free, no dairy" value={form.dietary_restrictions}
              onChange={(e) => set("dietary_restrictions", e.target.value)} className={inputClass} />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            {isEdit && (
              <button type="button" onClick={() => router.push("/dashboard")}
                className="flex-1 border border-gray-700 text-gray-300 py-3 rounded-xl font-semibold hover:bg-gray-800 transition">
                Cancel
              </button>
            )}
            <button type="submit" disabled={loading || !form.fitness_goal || !form.activity_level}
              className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-white py-3 rounded-xl font-semibold transition shadow-lg shadow-emerald-500/20 disabled:opacity-50">
              {loading ? "Saving..." : isEdit ? "Save Changes" : "Continue to Dashboard →"}
            </button>
          </div>

        </form>
      </div>
    </main>
  );
}
