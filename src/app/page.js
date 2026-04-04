import Link from "next/link";
import { 
  FiCpu, 
  FiEdit2, 
  FiClipboard,
  FiMessageSquare,
  FiGlobe,
  FiBarChart2,
  FiSettings,
  FiLink2,
  FiTrendingUp,
  FiMonitor,
  FiTrendingDown,
  FiLock,
  FiSmartphone,
  FiZap,
  FiCheck,
  FiFileText,
  FiImage,
} from "react-icons/fi";

export default function Home() {
  return (
    <main 
      className="min-h-screen text-gray-800"
      style={{
        background: `
          linear-gradient(135deg, rgba(248, 250, 249, 0.82), rgba(240, 244, 242, 0.82), rgba(248, 250, 249, 0.82)),
          url('https://i.pinimg.com/736x/2b/9d/7f/2b9d7ff3fb16c5932d0d8407fa59a9f8.jpg') center/cover fixed
        `,
      }}
    >

      {/* HERO */}
      <section className="text-center px-6 py-20">
        <h1 className="text-5xl font-bold leading-tight">
          Personalized AI Learning for <span className="text-green-600">Ethiopian Students</span>
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-gray-600">
          Qandil AI adapts to your learning level, study style, and goals. From quizzes to smart tutoring, it helps high school students learn better using local context and personalized guidance.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <Link href="/profile" className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition font-semibold">
            Start Your Learning Journey
          </Link>
          <Link href="/features" className="border border-gray-400 text-gray-800 px-6 py-3 rounded-xl hover:border-gray-600 transition font-semibold">
            Explore Features
          </Link>
        </div>
      </section>

      {/* FEATURES */}
      <section className="grid md:grid-cols-3 gap-8 px-6 md:px-16 py-16">
        {[
          {
            title: "AI Tutor (Personalized)",
            icon: <FiCpu className="w-12 h-12" />,
            desc: "Chat with an AI tutor that understands your level and explains concepts using simple language and local Ethiopian examples.",
            link: "/ai-assistance"
          },
          {
            title: "Smart Notes Generator",
            icon: <FiEdit2 className="w-12 h-12" />,
            desc: "Upload your documents and get easy-to-understand notes customized to your learning level and study method.",
            link: "/notes"
          },
          {
            title: "Assignment Guide",
            icon: <FiClipboard className="w-12 h-12" />,
            desc: "Instead of giving answers, AI guides you step-by-step so you can understand and solve assignments yourself.",
            link: "/assignment-guide"
          },
        ].map((item, i) => (
          <Link href={item.link} key={i}>
            <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition cursor-pointer h-full">
              <div className="text-green-600 mb-4">{item.icon}</div>
              <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          </Link>
        ))}
      </section>

      {/* COMPREHENSIVE FEATURES */}
      <section className="px-6 md:px-16 py-16 bg-white">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Powerful Features</h2>
          <p className="mt-2 text-gray-600">Discover what makes Qandil AI the ultimate learning companion</p>
        </div>

        {/* Core Platform Features */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-center mb-8 text-gray-900">Core Platform Features</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Natural Language Processing',
                description: 'Advanced NLP to understand context and nuance in every conversation',
                icon: <FiMessageSquare className="w-10 h-10 text-green-600" />,
              },
              {
                title: 'Multi-Language Support',
                description: 'Communicate in your preferred language with seamless translation',
                icon: <FiGlobe className="w-10 h-10 text-green-600" />,
              },
              {
                title: 'Machine Learning',
                description: 'Continuously improving algorithms that learn from interactions',
                icon: <FiBarChart2 className="w-10 h-10 text-green-600" />,
              },
              {
                title: 'Real-time Analysis',
                description: 'Instant data processing and analysis at scale',
                icon: <FiSettings className="w-10 h-10 text-green-600" />,
              },
              {
                title: 'Integration Ready',
                description: 'Easy integration with your existing tools and platforms',
                icon: <FiLink2 className="w-10 h-10 text-green-600" />,
              },
              {
                title: 'Custom Workflows',
                description: 'Create tailored workflows that match your specific needs',
                icon: <FiTrendingUp className="w-10 h-10 text-green-600" />,
              },
            ].map((feature, i) => (
              <div key={i} className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl shadow-sm hover:shadow-md transition border-l-4 border-green-500">
                <div className="mb-4">{feature.icon}</div>
                <h4 className="text-lg font-semibold mb-3 text-gray-900">{feature.title}</h4>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Student-Specific Features */}
        <div>
          <h3 className="text-2xl font-semibold text-center mb-8 text-gray-900">Personalized for Students</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: 'AI Quiz & Profile Tracking',
                description: 'Students take quizzes after registration. The AI stores their understanding level and adapts learning content.',
                icon: <FiMessageSquare className="w-10 h-10 text-teal-600" />,
              },
              {
                title: 'Notes Generation from Documents',
                description: 'Students submit documents, and the AI generates notes based on their level, simplifying learning.',
                icon: <FiFileText className="w-10 h-10 text-teal-600" />,
              },
              {
                title: 'Assignment Guidance',
                description: 'AI guides students step-by-step on assignments according to their current understanding.',
                icon: <FiTrendingUp className="w-10 h-10 text-teal-600" />,
              },
              {
                title: 'Image Analysis Tool',
                description: 'Students can upload images (like diagrams or handwritten notes), and the AI analyzes and explains them.',
                icon: <FiImage className="w-10 h-10 text-teal-600" />,
              },
            ].map((feature, i) => (
              <div key={i} className="bg-gradient-to-br from-teal-50 to-white p-8 rounded-2xl shadow-sm hover:shadow-md transition border-l-4 border-teal-500">
                <div className="mb-4">{feature.icon}</div>
                <h4 className="text-lg font-semibold mb-3 text-gray-900">{feature.title}</h4>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="px-6 md:px-16 py-16 bg-gradient-to-b from-gray-50 to-white">
        <h2 className="text-3xl font-bold text-center">How Qandil AI Works</h2>

        <div className="grid md:grid-cols-3 gap-10 mt-10">
          {[
            { step: "Create Your Profile", desc: "Register securely and set your grade, goals, and study preferences." },
            { step: "Take Smart Quiz", desc: "AI evaluates your understanding level and builds your personalized learning profile." },
            { step: "Learn with AI Tools", desc: "Use AI tutor, notes generator, assignment guide, and image analyzer tailored to you." },
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
            { title: "Truly Personalized", desc: "Adapts to your level, learning speed, and preferred study system for better results." },
            { title: "Built for Ethiopian Students", desc: "Uses local context and relatable examples to improve understanding." },
            { title: "Learn by Understanding", desc: "Focuses on guiding you to solutions instead of just giving answers." },
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
            { user: "High School Students", desc: "Get personalized AI tutoring aligned with your school curriculum and level." },
            { user: "Exam Preparation Students", desc: "Prepare smarter for national exams with guided practice and explanations." },
            { user: "Independent Learners", desc: "Learn at your own pace with AI support designed for your understanding level." },
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
          Learn Smarter with AI Designed for You
        </h2>
        <p className="mt-4 text-green-100">
          Join students across Ethiopia using Qandil AI to improve understanding, not just get answers.
        </p>

        <Link href="/profile">
          <button className="mt-8 bg-white text-green-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition">
            Get Started Now
          </button>
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="text-center py-8 text-gray-500 text-sm bg-white">
        © {new Date().getFullYear()} QandilAI. Empowering Ethiopian Students with AI.
      </footer>

    </main>
  );
}