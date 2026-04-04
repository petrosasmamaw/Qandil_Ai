import Link from 'next/link';
import {
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
} from 'react-icons/fi';

export const metadata = {
  title: 'Features | Qandil AI',
  description: 'Explore all the amazing features of Qandil AI',
};

export default function Features() {
  // Core platform features
  const features = [
    {
      title: 'Natural Language Processing',
      description:
        'Advanced NLP to understand context and nuance in every conversation',
      icon: <FiMessageSquare className="w-10 h-10 text-green-600" />,
    },
    {
      title: 'Multi-Language Support',
      description:
        'Communicate in your preferred language with seamless translation',
      icon: <FiGlobe className="w-10 h-10 text-green-600" />,
    },
    {
      title: 'Machine Learning',
      description:
        'Continuously improving algorithms that learn from interactions',
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
    {
      title: 'API Access',
      description: 'Powerful REST API for seamless integration and automation',
      icon: <FiMonitor className="w-10 h-10 text-green-600" />,
    },
    {
      title: 'Analytics Dashboard',
      description:
        'Comprehensive insights into AI performance and usage metrics',
      icon: <FiTrendingDown className="w-10 h-10 text-green-600" />,
    },
  ];

  // Personalized AI student features
  const studentFeatures = [
    {
      title: 'AI Quiz & Profile Tracking',
      description:
        'Students take quizzes after registration. The AI stores their understanding level and adapts learning content.',
      icon: <FiMessageSquare className="w-10 h-10 text-teal-600" />,
    },
    {
      title: 'Notes Generation from Documents',
      description:
        'Students submit documents, and the AI generates notes based on their level, simplifying learning.',
      icon: <FiFileText className="w-10 h-10 text-teal-600" />,
    },
    {
      title: 'Assignment Guidance',
      description:
        'AI guides students step-by-step on assignments according to their current understanding.',
      icon: <FiTrendingUp className="w-10 h-10 text-teal-600" />,
    },
    {
      title: 'Image Analysis Tool',
      description:
        'Students can upload images (like diagrams or handwritten notes), and the AI analyzes and explains them.',
      icon: <FiImage className="w-10 h-10 text-teal-600" />,
    },
    {
      title: 'Chat History & Progress Database',
      description:
        'All interactions and AI responses are stored, allowing students to track progress over time.',
      icon: <FiMonitor className="w-10 h-10 text-teal-600" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 dark:from-gray-900 dark:to-teal-900">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 flex items-center justify-center gap-2">
            <FiZap className="w-8 h-8 text-green-600" /> Powerful Features
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300">
            Discover what makes Qandil AI the ultimate choice for intelligent
            solutions
          </p>
        </div>

        {/* Core Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-8 border-l-4 border-green-500 hover:border-teal-500"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Personalized AI Features for Students */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Personalized AI Features for Students
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {studentFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-8 border-l-4 border-teal-500 hover:border-green-500"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="text-center space-y-4">
          <div>
            <Link
              href="/"
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition-colors mr-4"
            >
              ← Back to Home
            </Link>
            <Link
              href="/ai-assistance"
              className="inline-block bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
            >
              AI Assistance →
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}