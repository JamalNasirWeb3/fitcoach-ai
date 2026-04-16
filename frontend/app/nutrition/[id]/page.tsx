"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { api, MealPlan } from "@/lib/api";

interface Meal { meal: string; name: string; ingredients: string[]; calories: number; protein_g: number; carbs_g: number; fat_g: number; }
interface Day { day: string; meals: Meal[]; }

export default function MealPlanPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [plan, setPlan] = useState<MealPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleEmail() {
    setSending(true);
    try {
      await api.emailMealPlan(Number(id));
      setSent(true);
    } finally {
      setSending(false);
    }
  }

  useEffect(() => {
    api.listMealPlans()
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
      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!plan) return null;

  const planData = plan.plan_data as { days: Day[] };

  return (
    <main className="min-h-screen bg-gray-950 text-white">

      {/* Header image */}
      <div className="relative h-52 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1400&q=80&fit=crop&auto=format"
          alt="Healthy food"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950/50 to-gray-950" />
        <div className="absolute inset-0 flex flex-col justify-end px-4 sm:px-6 pb-6 max-w-3xl mx-auto w-full">
          <Link href="/dashboard" className="text-sm text-blue-400 hover:text-blue-300 mb-2">← Dashboard</Link>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black">{plan.title}</h1>
              <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-gray-400 mt-1">
                <span>{plan.daily_calories} kcal/day</span>
                <span>·</span>
                <span>P: {plan.protein_g}g</span>
                <span>C: {plan.carbs_g}g</span>
                <span>F: {plan.fat_g}g</span>
              </div>
            </div>
            <button onClick={handleEmail} disabled={sending || sent}
              className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50 transition w-full sm:w-auto shrink-0">
              {sent ? "✓ Sent!" : sending ? "Sending..." : "Email PDF"}
            </button>
          </div>
        </div>
      </div>

      {/* Macro summary bar */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4">
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Calories", value: `${plan.daily_calories}`, unit: "kcal", color: "text-yellow-400" },
            { label: "Protein", value: `${plan.protein_g}`, unit: "g", color: "text-red-400" },
            { label: "Carbs", value: `${plan.carbs_g}`, unit: "g", color: "text-blue-400" },
            { label: "Fat", value: `${plan.fat_g}`, unit: "g", color: "text-orange-400" },
          ].map(({ label, value, unit, color }) => (
            <div key={label} className="bg-gray-900 border border-gray-800 rounded-xl p-3 text-center">
              <p className={`text-lg font-black ${color}`}>{value}<span className="text-xs font-normal text-gray-500 ml-0.5">{unit}</span></p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-8 space-y-5">
        {planData.days?.map((day, i) => (
          <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            <div className="bg-blue-500/10 border-b border-gray-800 px-5 py-3">
              <h2 className="font-bold text-blue-400">{day.day}</h2>
            </div>
            <div className="divide-y divide-gray-800">
              {day.meals?.map((meal, j) => (
                <div key={j} className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">{meal.meal}</span>
                      <p className="font-semibold text-white mt-0.5">{meal.name}</p>
                    </div>
                    <span className="text-sm font-bold text-yellow-400 shrink-0">{meal.calories} kcal</span>
                  </div>
                  {meal.ingredients?.length > 0 && (
                    <p className="text-sm text-gray-500 mb-3 leading-relaxed">{meal.ingredients.join(", ")}</p>
                  )}
                  <div className="flex gap-2">
                    <span className="text-xs bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded-full">P: {meal.protein_g}g</span>
                    <span className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full">C: {meal.carbs_g}g</span>
                    <span className="text-xs bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2 py-0.5 rounded-full">F: {meal.fat_g}g</span>
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
