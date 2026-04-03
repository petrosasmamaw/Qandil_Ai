import Link from 'next/link';

export const metadata = {
  title: 'Features | Qandil AI',
  description: 'Explore all the amazing features of Qandil AI',
};

export default function Features() {
  const features = [
    {
      title: 'Natural Language Processing',
      description: 'Advanced NLP to understand context and nuance in every conversation',
      icon: '🗣️',
    },
    {
      title: 'Multi-Language Support',
      description: 'Communicate in your preferred language with seamless translation',
      icon: '🌍',
    },
    {
      title: 'Machine Learning',
      description: 'Continuously improving algorithms that learn from interactions',
      icon: '📊',
    },
    {
      title: 'Real-time Analysis',
      description: 'Instant data processing and analysis at scale',
      icon: '⚙️',
    },
    {
      title: 'Integration Ready',
      description: 'Easy integration with your existing tools and platforms',
      icon: '🔗',
    },
    {
      title: 'Custom Workflows',
      description: 'Create tailored workflows that match your specific needs',
      icon: '📈',
    },
    {
      title: 'API Access',
      description: 'Powerful REST API for seamless integration and automation',
      icon: '💻',
    },
    {
      title: 'Analytics Dashboard',
      description: 'Comprehensive insights into AI performance and usage metrics',
      icon: '📉',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 dark:from-gray-900 dark:to-teal-900">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            ✨ Powerful Features
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300">
            Discover what makes Qandil AI the ultimate choice for intelligent solutions
          </p>
        </div>

        {/* Features Grid */}
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

        {/* Feature Showcase */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Premium Enterprise Features
          </h2>
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center">
                  <span className="text-2xl">🔐</span>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Advanced Security
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  End-to-end encryption, role-based access control, and compliance with international standards
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center">
                  <span className="text-2xl">📱</span>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Cross-Platform
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Access Qandil AI from web, mobile, desktop, and command-line interfaces
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center">
                  <span className="text-2xl">🚀</span>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  High Performance
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Lightning-fast responses with 99.99% uptime guaranteed
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Plans Preview */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Plans & Pricing
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Starter', price: '$29/mo', features: ['Up to 1,000 requests', 'Basic analytics', 'Email support'] },
              { name: 'Professional', price: '$99/mo', features: ['Up to 10,000 requests', 'Advanced analytics', 'Priority support'], highlighted: true },
              { name: 'Enterprise', price: 'Custom', features: ['Unlimited requests', 'Custom analytics', '24/7 support'] },
            ].map((plan, index) => (
              <div
                key={index}
                className={`rounded-lg p-8 ${
                  plan.highlighted
                    ? 'bg-gradient-to-br from-teal-600 to-green-600 text-white shadow-xl scale-105'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                }`}
              >
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-3xl font-bold mb-6">{plan.price}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <span className="mr-3">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-2 rounded font-semibold transition-colors ${
                    plan.highlighted
                      ? 'bg-white text-teal-600 hover:bg-gray-100'
                      : 'bg-teal-600 text-white hover:bg-teal-700'
                  }`}
                >
                  Get Started
                </button>
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
