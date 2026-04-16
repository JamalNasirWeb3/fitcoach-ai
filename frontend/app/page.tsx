import Link from "next/link";

const VIDEOS = [
  {
    id: "YOUTUBE_VIDEO_ID_1",
    title: "Full Body Strength",
    label: "Men · Strength Training",
    color: "from-emerald-500 to-teal-600",
  },
  {
    id: "YOUTUBE_VIDEO_ID_2",
    title: "Cardio & Fat Burn",
    label: "Women · Cardio",
    color: "from-pink-500 to-rose-600",
  },
  {
    id: "YOUTUBE_VIDEO_ID_3",
    title: "Core & Flexibility",
    label: "Mixed · Yoga & Core",
    color: "from-violet-500 to-purple-600",
  },
];

const FEATURES = [
  {
    icon: "🧠",
    title: "AI-Personalized Plans",
    desc: "Claude AI builds your workout and meal plan based on your body stats and goals.",
  },
  {
    icon: "🥗",
    title: "Nutrition Guidance",
    desc: "7-day meal plans with full macro breakdowns tailored to your dietary needs.",
  },
  {
    icon: "📩",
    title: "PDF Delivery",
    desc: "Get your plan emailed as a beautifully formatted PDF, ready to print or save.",
  },
];

const STEPS = [
  { step: "01", title: "Create your profile", desc: "Enter your age, weight, height, goal and activity level." },
  { step: "02", title: "Generate your plan", desc: "AI builds a personalized workout & meal plan in seconds." },
  { step: "03", title: "Start training", desc: "Follow your plan and receive it as a PDF to your email." },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">

      {/* Nav */}
      <nav className="flex justify-between items-center px-4 sm:px-8 py-5 max-w-6xl mx-auto">
        <span className="text-2xl font-black text-emerald-400 tracking-tight">FitCoach AI</span>
        <div className="flex gap-3">
          <Link href="/login" className="text-gray-300 hover:text-white px-4 py-2 text-sm transition">Log In</Link>
          <Link href="/register" className="bg-emerald-500 hover:bg-emerald-400 text-white px-5 py-2 rounded-full text-sm font-semibold transition">
            Get Started Free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="text-center px-6 py-24 max-w-4xl mx-auto">
        <span className="inline-block bg-emerald-500/10 text-emerald-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 tracking-widest uppercase">
          Powered by Claude AI
        </span>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight mb-6">
          Your Personal<br />
          <span className="text-emerald-400">AI Fitness Coach</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
          Get a fully personalized workout and meal plan in seconds — built around your body, your goals, and your lifestyle.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/register"
            className="bg-emerald-500 hover:bg-emerald-400 text-white px-8 py-4 rounded-full font-bold text-lg transition shadow-lg shadow-emerald-500/20">
            Start for Free →
          </Link>
          <Link href="/login"
            className="border border-gray-700 hover:border-gray-500 text-gray-300 px-8 py-4 rounded-full font-semibold text-lg transition">
            Log In
          </Link>
        </div>
      </section>

      {/* Stats bar */}
      <div className="border-y border-gray-800 py-8 mb-20">
        <div className="max-w-4xl mx-auto grid grid-cols-3 divide-x divide-gray-800 text-center">
          {[["AI-Generated", "Workout Plans"], ["Macro-Optimized", "Meal Plans"], ["PDF Delivery", "To Your Email"]].map(([top, bot], i) => (
            <div key={i} className="px-6">
              <p className="text-emerald-400 font-bold text-lg">{top}</p>
              <p className="text-gray-500 text-sm">{bot}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Video Section */}
      <section className="px-6 max-w-6xl mx-auto mb-24">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black mb-3">Train Like a Pro</h2>
          <p className="text-gray-400 text-lg">Expert workouts for every body and every goal.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {VIDEOS.map((v) => (
            <div key={v.id} className="rounded-2xl overflow-hidden bg-gray-900 border border-gray-800 group">
              <div className="relative aspect-video">
                {v.id.startsWith("YOUTUBE") ? (
                  // Placeholder shown until real video IDs are added
                  <div className={`w-full h-full bg-gradient-to-br ${v.color} flex items-center justify-center`}>
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3">
                        <svg className="w-7 h-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                      <p className="text-white/70 text-xs">Add YouTube video ID</p>
                    </div>
                  </div>
                ) : (
                  <iframe
                    src={`https://www.youtube.com/embed/${v.id}?rel=0&modestbranding=1`}
                    title={v.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                )}
              </div>
              <div className="p-4">
                <span className={`text-xs font-semibold bg-gradient-to-r ${v.color} bg-clip-text text-transparent`}>
                  {v.label}
                </span>
                <p className="text-white font-bold mt-1">{v.title}</p>
              </div>
            </div>
          ))}
        </div>
        {/* Instructions for adding real videos */}
        <p className="text-center text-gray-600 text-xs mt-4">
          Replace YOUTUBE_VIDEO_ID_1/2/3 in <code className="text-gray-500">app/page.tsx</code> with real YouTube video IDs.
        </p>
      </section>

      {/* How it works */}
      <section className="px-6 max-w-5xl mx-auto mb-24">
        <h2 className="text-4xl font-black text-center mb-14">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {STEPS.map((s) => (
            <div key={s.step} className="relative bg-gray-900 border border-gray-800 rounded-2xl p-7">
              <span className="text-6xl font-black text-emerald-500/10 absolute top-4 right-5 select-none">{s.step}</span>
              <p className="text-emerald-400 font-bold text-sm mb-2">Step {s.step}</p>
              <h3 className="text-xl font-bold mb-2">{s.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-6 max-w-5xl mx-auto mb-24">
        <h2 className="text-4xl font-black text-center mb-14">Everything You Need</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <div key={f.title} className="bg-gray-900 border border-gray-800 rounded-2xl p-7 hover:border-emerald-800 transition">
              <span className="text-4xl mb-4 block">{f.icon}</span>
              <h3 className="text-lg font-bold mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 mb-24">
        <div className="max-w-3xl mx-auto bg-gradient-to-br from-emerald-900/50 to-teal-900/30 border border-emerald-800/50 rounded-3xl p-14 text-center">
          <h2 className="text-4xl font-black mb-4">Ready to Transform?</h2>
          <p className="text-gray-400 mb-8">Join FitCoach AI and get your personalized plan today.</p>
          <Link href="/register"
            className="bg-emerald-500 hover:bg-emerald-400 text-white px-10 py-4 rounded-full font-bold text-lg transition shadow-lg shadow-emerald-500/20">
            Get Your Free Plan →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 text-center text-gray-600 text-sm">
        © {new Date().getFullYear()} FitCoach AI — Personalized fitness powered by AI
      </footer>

    </main>
  );
}
