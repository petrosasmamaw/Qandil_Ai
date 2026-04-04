import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#F8FAF9] via-[#F0F4F2] to-[#F8FAF9] text-gray-800">

      {/* HERO */}
      <section className="text-center px-6 py-20">
        <h1 className="text-5xl font-bold leading-tight">
          Smart Learning <span className="text-green-600">Powered by AI</span>
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-gray-600">
          Personalized education with adaptive AI tutoring, intelligent notes generation, and smart assignment guidance tailored to every student.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <Link href="/profile" className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition font-semibold">
            Get Started
          </Link>
          <Link href="/features" className="border border-gray-400 text-gray-800 px-6 py-3 rounded-xl hover:border-gray-600 transition font-semibold">
            Learn More
          </Link>
        </div>
      </section>

      {/* FEATURES */}
      <section className="grid md:grid-cols-3 gap-8 px-6 md:px-16 py-16">
        {[
          {
            title: "AI Chat Tutor",
            icon: "🤖",
            desc: "Chat with a personalized AI tutor available 24/7. Get instant answers tailored to your learning level with adaptive explanations.",
            link: "/ai-assistance"
          },
          {
            title: "Smart Notes",
            icon: "📝",
            desc: "Upload study materials and convert them into personalized study notes. AI generates structured content for your learning system.",
            link: "/notes"
          },
          {
            title: "Assignment Help",
            icon: "📋",
            desc: "Get step-by-step guidance on your assignments. AI provides intelligent support tailored to your learning style.",
            link: "/assignment-guide"
          },
        ].map((item, i) => (
          <Link href={item.link} key={i}>
            <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition cursor-pointer h-full">
              <div className="text-5xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          </Link>
        ))}
      </section>

      {/* HOW IT WORKS */}
      <section className="px-6 md:px-16 py-16 bg-white">
        <h2 className="text-3xl font-bold text-center">How Qandil AI Works</h2>

        <div className="grid md:grid-cols-3 gap-10 mt-10">
          {[
            { step: "Create Your Profile", desc: "Set up your learning profile with your grade, learning level, and goals." },
            { step: "Share Your Content", desc: "Upload study materials, ask questions, or paste assignments for AI analysis." },
            { step: "Get Personalized Help", desc: "Receive tailored tutoring, notes, or assignment guidance based on your profile." },
          ].map((step, i) => (
            <div key={i} className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-4">
                {i + 1}
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{step.step}</h3>
              <p className="text-gray-600 text-sm">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WHY CHOOSE */}
      <section className="px-6 md:px-16 py-16">
        <h2 className="text-3xl font-bold text-center">Why Choose Qandil AI</h2>

        <div className="grid md:grid-cols-3 gap-8 mt-10">
          {[
            { title: "Personalized Learning", desc: "Adapts to your learning level, study system, and goals for maximum effectiveness." },
            { title: "AI-Powered Insights", desc: "Advanced algorithms analyze your needs and provide intelligent, targeted support." },
            { title: "24/7 Availability", desc: "Always available when you need help. Study at your own pace, anytime, anywhere." },
          ].map((item, i) => (
            <div key={i} className="p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition">
              <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WHO IT'S FOR */}
      <section className="px-6 md:px-16 py-16 bg-white">
        <h2 className="text-3xl font-bold text-center">Who It's For</h2>

        <div className="grid md:grid-cols-3 gap-8 mt-10">
          {[
            { user: "Students", desc: "Get personalized tutoring and assignment help tailored to your learning level." },
            { user: "Educators", desc: "Support your teaching with AI-powered tools for student engagement and success." },
            { user: "Self-Learners", desc: "Learn independently with adaptive AI guidance and comprehensive study resources." },
          ].map((item, i) => (
            <div key={i} className="p-6 border border-gray-300 rounded-xl text-center hover:shadow-md transition">
              <h3 className="font-semibold text-gray-900 mb-2">{item.user}</h3>
              <p className="text-gray-600 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center px-6 py-20 bg-green-600 text-white">
        <h2 className="text-4xl font-bold">
          Start Your AI Learning Journey Today
        </h2>
        <p className="mt-4 text-green-100">
          Join thousands of students learning smarter with personalized AI assistance.
        </p>

        <Link href="/profile">
          <button className="mt-8 bg-white text-green-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition">
            Get Started Now
          </button>
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="text-center py-8 text-gray-500 text-sm bg-white">
        © {new Date().getFullYear()} QandilAI. All rights reserved.
      </footer>

    </main>
  );
}
