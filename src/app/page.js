'use client';

import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";
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
  const { t } = useTranslation();
  return (
    <main 
      className="min-h-screen dark:bg-gray-900 bg-white text-gray-800 dark:text-gray-100 transition-colors duration-300"
    >

      {/* HERO */}
      <section className="text-center px-6 py-20">
        <h1 className="text-5xl font-bold leading-tight text-gray-900 dark:text-white">
          {t('home.hero.title')} <span className="text-green-600 dark:text-green-500">{t('home.hero.titleHighlight')}</span>
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
          {t('home.hero.tagline')}
        </p>

        <div className="mt-8 flex justify-center gap-4 flex-wrap">
          <Link href="/profile" className="bg-green-600 dark:bg-green-700 text-white px-6 py-3 rounded-xl hover:bg-green-700 dark:hover:bg-green-600 transition font-semibold">
            {t('home.hero.startJourney')}
          </Link>
          <Link href="/features" className="border border-gray-400 dark:border-gray-500 text-gray-800 dark:text-gray-200 px-6 py-3 rounded-xl hover:border-gray-600 dark:hover:border-gray-400 transition font-semibold">
            {t('home.hero.exploreFeatures')}
          </Link>
        </div>
      </section>

      {/* FEATURES */}
      <section className="grid md:grid-cols-3 gap-8 px-6 md:px-16 py-16">
        {[
          {
            title: t('home.features.title1'),
            icon: <FiCpu className="w-12 h-12" />,
            desc: t('home.features.desc1'),
            link: "/ai-assistance"
          },
          {
            title: t('home.features.title2'),
            icon: <FiEdit2 className="w-12 h-12" />,
            desc: t('home.features.desc2'),
            link: "/notes"
          },
          {
            title: t('home.features.title3'),
            icon: <FiClipboard className="w-12 h-12" />,
            desc: t('home.features.desc3'),
            link: "/assignment-guide"
          },
        ].map((item, i) => (
          <Link href={item.link} key={i}>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm dark:shadow-lg hover:shadow-md dark:hover:shadow-xl transition cursor-pointer h-full">
              <div className="text-green-600 dark:text-green-500 mb-4">{item.icon}</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">{item.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{item.desc}</p>
            </div>
          </Link>
        ))}
      </section>

      {/* COMPREHENSIVE FEATURES */}
      <section className="px-6 md:px-16 py-16 bg-white dark:bg-gray-800 transition-colors duration-300">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{t('home.powerfulFeatures')}</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">{t('home.discoverFeatures')}</p>
        </div>

        {/* Core Platform Features */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-center mb-8 text-gray-900 dark:text-white">{t('home.corePlatform')}</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: t('home.nlp.title'),
                description: t('home.nlp.desc'),
                icon: <FiMessageSquare className="w-10 h-10 text-green-600 dark:text-green-500" />,
              },
              {
                title: t('home.multiLanguage.title'),
                description: t('home.multiLanguage.desc'),
                icon: <FiGlobe className="w-10 h-10 text-green-600 dark:text-green-500" />,
              },
              {
                title: t('home.machineLearning.title'),
                description: t('home.machineLearning.desc'),
                icon: <FiBarChart2 className="w-10 h-10 text-green-600 dark:text-green-500" />,
              },
              {
                title: t('home.realTimeAnalysis.title'),
                description: t('home.realTimeAnalysis.desc'),
                icon: <FiSettings className="w-10 h-10 text-green-600 dark:text-green-500" />,
              },
              {
                title: t('home.integrationReady.title'),
                description: t('home.integrationReady.desc'),
                icon: <FiLink2 className="w-10 h-10 text-green-600 dark:text-green-500" />,
              },
              {
                title: t('home.customWorkflows.title'),
                description: t('home.customWorkflows.desc'),
                icon: <FiTrendingUp className="w-10 h-10 text-green-600 dark:text-green-500" />,
              },
            ].map((feature, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm hover:shadow-md transition border-l-4 border-green-500 dark:border-green-600">
                <div className="mb-4">{feature.icon}</div>
                <h4 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">{feature.title}</h4>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Student-Specific Features */}
        <div>
          <h3 className="text-2xl font-semibold text-center mb-8 text-gray-900 dark:text-white">{t('home.personalizedForStudents')}</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: t('home.aiQuiz.title'),
                description: t('home.aiQuiz.desc'),
                icon: <FiMessageSquare className="w-10 h-10 text-teal-600 dark:text-teal-400" />,
              },
              {
                title: t('home.notesGeneration.title'),
                description: t('home.notesGeneration.desc'),
                icon: <FiFileText className="w-10 h-10 text-teal-600 dark:text-teal-400" />,
              },
              {
                title: t('home.assignmentGuidance.title'),
                description: t('home.assignmentGuidance.desc'),
                icon: <FiTrendingUp className="w-10 h-10 text-teal-600 dark:text-teal-400" />,
              },
              {
                title: t('home.imageAnalysis.title'),
                description: t('home.imageAnalysis.desc'),
                icon: <FiImage className="w-10 h-10 text-teal-600 dark:text-teal-400" />,
              },
            ].map((feature, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm hover:shadow-md dark:hover:shadow-lg transition border-l-4 border-teal-500 dark:border-teal-600">
                <div className="mb-4">{feature.icon}</div>
                <h4 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">{feature.title}</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="px-6 md:px-16 py-16 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">{t('home.howItWorks')}</h2>

        <div className="grid md:grid-cols-3 gap-10 mt-10">
          {[
            { step: t('home.createProfile'), desc: t('home.createProfileDesc') },
            { step: t('home.takeQuiz'), desc: t('home.takeQuizDesc') },
            { step: t('home.learnWithAI'), desc: t('home.learnWithAIDesc') },
          ].map((step, i) => (
            <div key={i} className="text-center">
              <div className="text-4xl font-bold text-green-600 dark:text-green-500 mb-4">
                {i + 1}
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{step.step}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WHY CHOOSE */}
      <section className="px-6 md:px-16 py-16 bg-white dark:bg-gray-900 transition-colors duration-300">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">{t('home.whyChoose')}</h2>

        <div className="grid md:grid-cols-3 gap-8 mt-10">
          {[
            { title: t('home.trulyPersonalized'), desc: t('home.trulyPersonalizedDesc') },
            { title: t('home.builtForEthiopia'), desc: t('home.builtForEthiopiaDesc') },
            { title: t('home.learnByUnderstanding'), desc: t('home.learnByUnderstandingDesc') },
          ].map((item, i) => (
            <div key={i} className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md dark:hover:shadow-lg transition">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WHO IT'S FOR */}
      <section className="px-6 md:px-16 py-16 bg-white dark:bg-gray-800 transition-colors duration-300">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">{t('home.whoItFor')}</h2>

        <div className="grid md:grid-cols-3 gap-8 mt-10">
          {[
            { user: t('home.highSchool'), desc: t('home.highSchoolDesc') },
            { user: t('home.examPrep'), desc: t('home.examPrepDesc') },
            { user: t('home.independentLearners'), desc: t('home.independentLearnersDesc') },
          ].map((item, i) => (
            <div key={i} className="p-6 border border-gray-300 dark:border-gray-600 rounded-xl text-center hover:shadow-md dark:hover:shadow-lg transition dark:bg-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{item.user}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center px-6 py-20 bg-green-600 dark:bg-green-700 text-white transition-colors duration-300">
        <h2 className="text-4xl font-bold">
          {t('home.learnSmarter')}
        </h2>
        <p className="mt-4 text-green-100 dark:text-green-50">
          {t('home.joinStudentsEthiopia')}
        </p>

        <Link href="/profile">
          <button className="mt-8 bg-white dark:bg-gray-100 text-green-600 dark:text-green-700 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 dark:hover:bg-gray-200 transition">
            {t('home.getStarted')}
          </button>
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm bg-white dark:bg-gray-900 transition-colors duration-300">
        © {new Date().getFullYear()} QandilAI. {t('home.empoweringStudents')}
      </footer>

    </main>
  );
}