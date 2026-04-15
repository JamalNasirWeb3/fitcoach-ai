"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
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

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!plan) return null;

  const planData = plan.plan_data as { days: Day[] };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <Link href="/dashboard" className="text-sm text-blue-600 hover:underline">← Dashboard</Link>
            <h1 className="text-2xl font-bold text-gray-800 mt-1">{plan.title}</h1>
            <div className="flex gap-4 text-sm text-gray-500 mt-1">
              <span>{plan.daily_calories} kcal/day</span>
              <span>Protein: {plan.protein_g}g</span>
              <span>Carbs: {plan.carbs_g}g</span>
              <span>Fat: {plan.fat_g}g</span>
            </div>
          </div>
          <button onClick={handleEmail} disabled={sending || sent}
            className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition">
            {sent ? "Sent!" : sending ? "Sending..." : "Email PDF"}
          </button>
        </div>

        {planData.days?.map((day, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="bg-blue-50 px-5 py-3 rounded-t-xl">
              <h2 className="font-bold text-blue-800">{day.day}</h2>
            </div>
            <div className="divide-y">
              {day.meals?.map((meal, j) => (
                <div key={j} className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="text-xs text-blue-600 font-semibold uppercase tracking-wide">{meal.meal}</span>
                      <p className="font-semibold text-gray-800">{meal.name}</p>
                    </div>
                    <span className="text-sm font-medium text-gray-600">{meal.calories} kcal</span>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">{meal.ingredients?.join(", ")}</p>
                  <div className="flex gap-3 text-xs text-gray-400">
                    <span>P: {meal.protein_g}g</span>
                    <span>C: {meal.carbs_g}g</span>
                    <span>F: {meal.fat_g}g</span>
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
