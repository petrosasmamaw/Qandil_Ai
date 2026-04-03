import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 font-sans">
      <main className="flex flex-col items-center justify-start px-4 sm:px-16 py-20">
        {/* Hero Section */}
        <div className="text-center space-y-6 mb-16 max-w-4xl">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Qandil AI
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-4">
              Your Personal AI-Powered Educational Assistant
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Experience personalized learning with AI tutoring, smart notes generation, and intelligent assignment guidance tailored to your unique learning style.
            </p>
          </div>
        </div>

        {/* Core Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 w-full max-w-6xl">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-700">
            <div className="text-5xl mb-4">🤖</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">AI Tutoring</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Chat with a personalized AI tutor available 24/7. Get instant answers to your questions with explanations tailored to your learning level.
            </p>
            <Link href="/ai-assistance" className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium mt-3 inline-block">
              Go to AI Assistance →
            </Link>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-700">
            <div className="text-5xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Smart Notes</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Upload study materials or paste text. AI generates personalized study notes adapted to your learning level and study system.
            </p>
            <Link href="/notes" className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium mt-3 inline-block">
              Generate Notes →
            </Link>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-700">
            <div className="text-5xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Assignment Help</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Upload assignments or paste the instructions. Get personalized guidance and step-by-step help to approach your assignments effectively.
            </p>
            <Link href="/assignment-guide" className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium mt-3 inline-block">
              Get Assignment Guide →
            </Link>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-700">
            <div className="text-5xl mb-4">👤</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Your Profile</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Create your learning profile with your level, study system, and goals. All AI features personalize to your unique learning style.
            </p>
            <Link href="/profile" className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium mt-3 inline-block">
              Create Profile →
            </Link>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="w-full max-w-6xl mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-12 text-center">How Qandil AI Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800 text-center">
              <div className="text-4xl mb-3 font-bold text-blue-600 dark:text-blue-400">1</div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Create Profile</h3>
              <p className="text-sm text-gray-700 dark:text-gray-400">
                Set up your learning profile with your grade, learning level, study system, and learning goals.
              </p>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6 border border-purple-200 dark:border-purple-800 text-center">
              <div className="text-4xl mb-3 font-bold text-purple-600 dark:text-purple-400">2</div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Upload or Paste</h3>
              <p className="text-sm text-gray-700 dark:text-gray-400">
                Share study materials, assignments, or questions via file upload or text input.
              </p>
            </div>

            <div className="bg-pink-50 dark:bg-pink-900/20 rounded-lg p-6 border border-pink-200 dark:border-pink-800 text-center">
              <div className="text-4xl mb-3 font-bold text-pink-600 dark:text-pink-400">3</div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">AI Processes</h3>
              <p className="text-sm text-gray-700 dark:text-gray-400">
                AI analyzes your content based on your profile, learning level, and goals.
              </p>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 border border-green-200 dark:border-green-800 text-center">
              <div className="text-4xl mb-3 font-bold text-green-600 dark:text-green-400">4</div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Get Results</h3>
              <p className="text-sm text-gray-700 dark:text-gray-400">
                Receive personalized study notes, tutoring, or assignment guidance tailored just for you.
              </p>
            </div>
          </div>
        </div>

        {/* Key Features Section */}
        <div className="w-full max-w-6xl mb-16 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">Why Choose Qandil AI?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🎯</span>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Personalized Learning</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Every response adapts to your learning level, study system, and goals.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-2xl">📚</span>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Study Notes Generator</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Transform any document or text into well-organized study notes in seconds.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-2xl">💡</span>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Intelligent Guidance</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Get step-by-step guidance on assignments without just doing the work for you.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-2xl">🤝</span>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">24/7 AI Tutor</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Always available whenever you need help with your studies.</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">📄</span>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Multiple Input Methods</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Upload PDF/Word files or paste text directly - whatever works for you.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-2xl">🧠</span>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Learning Level Awareness</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">From Foundation to Analytical, AI adjusts content depth to match your level.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-2xl">⚙️</span>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Study System Alignment</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Supports Theoretical, Conceptual, Exam-Oriented, Problem-Solving, and Mixed approaches.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-2xl">🔒</span>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Secure & Private</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Your data is protected with secure session management and privacy controls.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="w-full max-w-4xl mb-16">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-8 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Learning?</h2>
            <p className="text-lg mb-6 text-blue-100">
              Start using Qandil AI today and experience personalized education like never before.
            </p>
            <Link
              href="/profile"
              className="inline-block px-8 py-3 bg-white text-blue-600 rounded-lg font-bold hover:bg-gray-100 transition-colors"
            >
              Get Started Now 🚀
            </Link>
          </div>
        </div>

        {/* Student Benefits Section */}
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/30 rounded-lg p-6 border border-blue-200 dark:border-blue-700">
            <h3 className="text-xl font-bold text-blue-900 dark:text-blue-200 mb-3">For Quick Learners</h3>
            <ul className="space-y-2 text-blue-800 dark:text-blue-300 text-sm">
              <li>✓ Quick revision summaries</li>
              <li>✓ Fast study note generation</li>
              <li>✓ Efficient exam preparation</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-purple-100 to-purple-50 dark:from-purple-900/30 dark:to-purple-800/30 rounded-lg p-6 border border-purple-200 dark:border-purple-700">
            <h3 className="text-xl font-bold text-purple-900 dark:text-purple-200 mb-3">For Deep Learners</h3>
            <ul className="space-y-2 text-purple-800 dark:text-purple-300 text-sm">
              <li>✓ In-depth concept explanations</li>
              <li>✓ Comprehensive study materials</li>
              <li>✓ Critical thinking challenges</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-pink-100 to-pink-50 dark:from-pink-900/30 dark:to-pink-800/30 rounded-lg p-6 border border-pink-200 dark:border-pink-700">
            <h3 className="text-xl font-bold text-pink-900 dark:text-pink-200 mb-3">For All Learners</h3>
            <ul className="space-y-2 text-pink-800 dark:text-pink-300 text-sm">
              <li>✓ 24/7 personalized support</li>
              <li>✓ Multiple input methods</li>
              <li>✓ Consistent quality responses</li>
            </ul>
          </div>
        </div>

        {/* Tip Section */}
        <div className="w-full max-w-4xl mb-12 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border-2 border-blue-200 dark:border-blue-800">
          <p className="text-gray-900 dark:text-gray-100 text-lg">
            <span className="font-bold">💡 Pro Tip:</span> Start by creating your learning profile to get the best personalized experience. The more accurate your profile, the better Qandil AI can tailor its responses to your learning needs.
          </p>
        </div>
      </main>
    </div>
  );
}
