"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

const GOALS = [
  { value: "lose_weight", label: "Lose Weight" },
  { value: "build_muscle", label: "Build Muscle" },
  { value: "improve_longevity", label: "Improve Longevity" },
  { value: "general_fitness", label: "General Fitness" },
];

const ACTIVITY_LEVELS = [
  { value: "sedentary", label: "Sedentary (little or no exercise)" },
  { value: "lightly_active", label: "Lightly Active (1-3 days/week)" },
  { value: "moderately_active", label: "Moderately Active (3-5 days/week)" },
  { value: "very_active", label: "Very Active (6-7 days/week)" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    age: "",
    weight_kg: "",
    height_cm: "",
    gender: "",
    activity_level: "",
    fitness_goal: "",
    dietary_restrictions: "",
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
        const hasProfile = !!(user.fitness_goal && user.weight_kg);
        setIsEdit(hasProfile);
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

  if (fetching) return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading...</div>;

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-lg space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {isEdit ? "Edit Your Profile" : "Set Up Your Profile"}
          </h1>
          <p className="text-gray-500 text-sm mt-1">This helps us personalize your plans.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
              <input type="number" value={form.age} onChange={(e) => set("age", e.target.value)} required
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select value={form.gender} onChange={(e) => set("gender", e.target.value)} required
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400">
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
              <input type="number" step="0.1" value={form.weight_kg} onChange={(e) => set("weight_kg", e.target.value)} required
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
              <input type="number" value={form.height_cm} onChange={(e) => set("height_cm", e.target.value)} required
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fitness Goal</label>
            <div className="grid grid-cols-2 gap-2">
              {GOALS.map((g) => (
                <button type="button" key={g.value}
                  onClick={() => set("fitness_goal", g.value)}
                  className={`px-3 py-2 rounded-lg border text-sm font-medium transition ${
                    form.fitness_goal === g.value
                      ? "bg-emerald-600 text-white border-emerald-600"
                      : "border-gray-300 text-gray-700 hover:border-emerald-400"
                  }`}>
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Activity Level</label>
            <select value={form.activity_level} onChange={(e) => set("activity_level", e.target.value)} required
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400">
              <option value="">Select</option>
              {ACTIVITY_LEVELS.map((a) => (
                <option key={a.value} value={a.value}>{a.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dietary Restrictions <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input type="text" placeholder="e.g. vegan, gluten-free" value={form.dietary_restrictions}
              onChange={(e) => set("dietary_restrictions", e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400" />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex gap-3">
            {isEdit && (
              <button type="button" onClick={() => router.push("/dashboard")}
                className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-50 transition">
                Cancel
              </button>
            )}
            <button type="submit" disabled={loading || !form.fitness_goal}
              className="flex-1 bg-emerald-600 text-white py-2 rounded-lg font-semibold hover:bg-emerald-700 disabled:opacity-50 transition">
              {loading ? "Saving..." : isEdit ? "Save Changes" : "Continue to Dashboard"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
