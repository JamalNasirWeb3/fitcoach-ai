const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function getToken() {
  return typeof window !== "undefined" ? localStorage.getItem("token") : null;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || "Request failed");
  }
  return res.json();
}

export const api = {
  // Auth
  register: (email: string, password: string, full_name: string) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, full_name }),
    }),

  login: async (email: string, password: string): Promise<{ access_token: string }> => {
    const form = new URLSearchParams({ username: email, password });
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form.toString(),
    });
    if (!res.ok) throw new Error("Invalid credentials");
    return res.json();
  },

  // User
  getMe: () => request<UserProfile>("/users/me"),
  updateProfile: (data: Partial<UserProfile>) =>
    request<UserProfile>("/users/me", { method: "PATCH", body: JSON.stringify(data) }),

  // Workout
  generateWorkout: (params: { duration_weeks: number; sessions_per_week: number; additional_notes?: string }) =>
    request<WorkoutPlan>("/workout/generate", { method: "POST", body: JSON.stringify(params) }),
  listWorkouts: () => request<WorkoutPlan[]>("/workout/"),

  // Nutrition
  generateMealPlan: (params: { additional_notes?: string }) =>
    request<MealPlan>("/nutrition/generate", { method: "POST", body: JSON.stringify(params) }),
  listMealPlans: () => request<MealPlan[]>("/nutrition/"),

  // Email
  emailWorkoutPlan: (planId: number, email?: string) =>
    request(`/workout/${planId}/email`, { method: "POST", body: JSON.stringify({ email: email || null }) }),
  emailMealPlan: (planId: number, email?: string) =>
    request(`/nutrition/${planId}/email`, { method: "POST", body: JSON.stringify({ email: email || null }) }),
};

export interface UserProfile {
  id: number;
  email: string;
  full_name: string;
  age?: number;
  weight_kg?: number;
  height_cm?: number;
  gender?: string;
  activity_level?: string;
  fitness_goal?: string;
  dietary_restrictions?: string;
}

export interface WorkoutPlan {
  id: number;
  user_id: number;
  title: string;
  duration_weeks: number;
  sessions_per_week: number;
  plan_data: Record<string, unknown>;
  created_at: string;
}

export interface MealPlan {
  id: number;
  user_id: number;
  title: string;
  daily_calories?: number;
  protein_g?: number;
  carbs_g?: number;
  fat_g?: number;
  plan_data: Record<string, unknown>;
  created_at: string;
}
