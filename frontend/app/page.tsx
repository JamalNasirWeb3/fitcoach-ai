import Link from "next/link";
import Image from "next/image";

const FEATURES = [
  {
    img: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&q=80&fit=crop&auto=format",
    title: "AI-Personalized Workouts",
    desc: "Claude AI builds your training program based on your body stats, goal, and schedule.",
  },
  {
    img: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=80&fit=crop&auto=format",
    title: "Nutrition Guidance",
    desc: "7-day meal plans with full macro breakdowns tailored to your dietary needs.",
  },
  {
    img: "https://images.unsplash.com/photo-1571019614099-981c25e80c4e?w=600&q=80&fit=crop&auto=format",
    title: "PDF Delivery",
    desc: "Get your plan emailed as a beautifully formatted PDF, ready to print or save.",
  },
];

const STEPS = [
  { step: "01", title: "Create your profile", desc: "Enter your age, weight, height, goal and activity level." },
  { step: "02", title: "Generate your plan", desc: "AI builds a personalized workout & meal plan in seconds." },
  { step: "03", title: "Start training", desc: "Follow your plan and receive it as a PDF to your email." },
];

const STATS = [
  { value: "AI-Generated", label: "Workout Plans" },
  { value: "Macro-Optimized", label: "Meal Plans" },
  { value: "PDF Delivery", label: "To Your Email" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">

      {/* Nav */}
      <nav className="absolute top-0 left-0 right-0 z-20 flex justify-between items-center px-4 sm:px-8 py-5 max-w-6xl mx-auto">
        <span className="text-2xl font-black text-emerald-400 tracking-tight">FitCoach AI</span>
        <div className="flex gap-3">
          <Link href="/login" className="text-gray-300 hover:text-white px-4 py-2 text-sm transition">Log In</Link>
          <Link href="/register" className="bg-emerald-500 hover:bg-emerald-400 text-white px-5 py-2 rounded-full text-sm font-semibold transition">
            Get Started Free
          </Link>
        </div>
      </nav>

      {/* Hero — full-screen gym image with overlay */}
      <section className="relative min-h-screen flex items-center justify-center text-center px-6">
        <Image
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1600&q=80&fit=crop&auto=format"
          alt="Gym"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950/80 via-gray-950/60 to-gray-950" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <span className="inline-block bg-emerald-500/20 text-emerald-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 tracking-widest uppercase border border-emerald-500/30">
            Powered by Claude AI
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight mb-6">
            Your Personal<br />
            <span className="text-emerald-400">AI Fitness Coach</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10">
            Get a fully personalized workout and meal plan in seconds — built around your body, your goals, and your lifestyle.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/register"
              className="bg-emerald-500 hover:bg-emerald-400 text-white px-8 py-4 rounded-full font-bold text-lg transition shadow-lg shadow-emerald-500/30">
              Start for Free →
            </Link>
            <Link href="/login"
              className="border border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white px-8 py-4 rounded-full font-semibold text-lg transition backdrop-blur-sm">
              Log In
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <div className="border-y border-gray-800 py-8 bg-gray-950">
        <div className="max-w-4xl mx-auto grid grid-cols-3 divide-x divide-gray-800 text-center">
          {STATS.map(({ value, label }) => (
            <div key={label} className="px-6">
              <p className="text-emerald-400 font-bold text-lg">{value}</p>
              <p className="text-gray-500 text-sm">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features with images */}
      <section className="px-6 max-w-6xl mx-auto py-24">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-black mb-3">Everything You Need</h2>
          <p className="text-gray-400 text-lg">One platform. Total fitness transformation.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <div key={f.title} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-emerald-800 transition group">
              <div className="relative h-48 overflow-hidden">
                <Image src={f.img} alt={f.title} fill className="object-cover group-hover:scale-105 transition duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 max-w-5xl mx-auto pb-24">
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

      {/* Split CTA with image */}
      <section className="px-6 pb-24 max-w-6xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=1400&q=80&fit=crop&auto=format"
            alt="Training"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/90 to-gray-950/40" />
          <div className="relative z-10 px-10 sm:px-16 py-20 max-w-xl">
            <h2 className="text-4xl font-black mb-4">Ready to Transform?</h2>
            <p className="text-gray-300 mb-8 text-lg">Join FitCoach AI and get your personalized plan today. Free to start.</p>
            <Link href="/register"
              className="inline-block bg-emerald-500 hover:bg-emerald-400 text-white px-10 py-4 rounded-full font-bold text-lg transition shadow-lg shadow-emerald-500/30">
              Get Your Free Plan →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 text-center text-gray-600 text-sm">
        © {new Date().getFullYear()} FitCoach AI — Personalized fitness powered by AI
      </footer>

    </main>
  );
}
