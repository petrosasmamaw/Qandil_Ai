'use client';

import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";
import { useEffect, useState } from "react";
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
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check initial theme
    const dark = document.documentElement.classList.contains('dark');
    setIsDark(dark);

    // Listen to theme changes
    const observer = new MutationObserver(() => {
      const isDarkMode = document.documentElement.classList.contains('dark');
      setIsDark(isDarkMode);
    });

    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['class'] 
    });

    return () => observer.disconnect();
  }, []);

  const backgroundStyle = {
    backgroundImage: isDark
      ? `
        linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(25, 40, 70, 0.93) 50%, rgba(15, 23, 42, 0.95) 100%),
        url('https://images.openai.com/static-rsc-4/UhK-ZnGnaOc26fOHcPEMngdrJMi0lBmw_eKNkaDh38qqO6xopIWrT3GyMD_7F0bUEwvEgsSxHAA7F9eZ0sIsr6zwzCbSZXRwDuam2ZAsT_4kprqEa4D6b_95yr-58SC2Fzcww7u8K9AFRoRHVUJ2ItNncyjWPfYYxDDhB96QIwwOEW1mvB1bi6CkXIYSZjje?purpose=inline')
      `
      : `
        linear-gradient(135deg, rgba(255, 255, 255, 0.97) 0%, rgba(240, 248, 255, 0.95) 50%, rgba(255, 255, 255, 0.97) 100%),
        url('https://images.openai.com/static-rsc-4/b9GSMauiGKlA6VMEEc1Xdi4OCektiyGX3D_mPMB8DXDy35G_W_KrrXLaHa4lGrgAyiVqacvBM29zArkzEe21HJJWSPfb5aa7FxiVNswdzZHaZQ5Ez4zkzFJYMuC_0OlYOPvQ2MEMajSfEF9Xg-ncWCqeweMsSF80k9KZPPUa8jRjxpinxETr8iUE0TyHnFX4?purpose=inline')
      `,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
  };

  return (
    <main 
      className="min-h-screen text-gray-800 dark:text-gray-100 transition-colors duration-300"
      style={backgroundStyle}
    >

      {/* HERO */}
      <section className="text-center px-6 py-20 relative">
        {/* Beautiful Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-green-500/10 dark:from-green-600/20 to-transparent pointer-events-none"></div>
        
        <div className="relative z-10">
          <h1 className="text-5xl font-bold leading-tight text-gray-900 dark:text-white drop-shadow-lg">
            {t('home.hero.title')} <span className="bg-gradient-to-r from-green-600 to-green-500 dark:from-green-400 dark:to-green-300 bg-clip-text text-transparent">{t('home.hero.titleHighlight')}</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-gray-700 dark:text-gray-200 drop-shadow-md text-lg">
            {t('home.hero.tagline')}
          </p>

          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            <Link href="/profile" className="bg-gradient-to-r from-green-600 to-green-700 dark:from-green-500 dark:to-green-600 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:scale-105 transition-all font-semibold backdrop-blur-sm">
              {t('home.hero.startJourney')}
            </Link>
            <Link href="/features" className="backdrop-blur-sm border-2 border-gray-400 dark:border-gray-300 text-gray-800 dark:text-gray-100 px-6 py-3 rounded-xl hover:shadow-lg hover:scale-105 transition-all font-semibold bg-white/40 dark:bg-gray-800/40">
              {t('home.hero.exploreFeatures')}
            </Link>
          </div>
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
            <div className="backdrop-blur-md bg-white/85 dark:bg-gray-800/70 p-6 rounded-2xl shadow-lg dark:shadow-2xl hover:shadow-xl dark:hover:shadow-2xl transition-all hover:scale-105 cursor-pointer h-full border border-white/20 dark:border-gray-700/30">
              <div className="text-green-600 dark:text-green-400 mb-4">{item.icon}</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">{item.title}</h3>
              <p className="text-gray-700 dark:text-gray-300">{item.desc}</p>
            </div>
          </Link>
        ))}
      </section>

      {/* COMPREHENSIVE FEATURES */}
      <section className="px-6 md:px-16 py-16 backdrop-blur-sm bg-white/60 dark:bg-gray-900/60 transition-colors duration-300 border-t border-white/20 dark:border-gray-700/30">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white drop-shadow-lg">{t('home.powerfulFeatures')}</h2>
          <p className="mt-2 text-gray-700 dark:text-gray-300">{t('home.discoverFeatures')}</p>
        </div>

        {/* Core Platform Features */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-center mb-8 text-gray-900 dark:text-white">{t('home.corePlatform')}</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: t('home.nlp.title'),
                description: t('home.nlp.desc'),
                icon: <FiMessageSquare className="w-10 h-10 text-green-600 dark:text-green-400" />,
              },
              {
                title: t('home.multiLanguage.title'),
                description: t('home.multiLanguage.desc'),
                icon: <FiGlobe className="w-10 h-10 text-green-600 dark:text-green-400" />,
              },
              {
                title: t('home.machineLearning.title'),
                description: t('home.machineLearning.desc'),
                icon: <FiBarChart2 className="w-10 h-10 text-green-600 dark:text-green-400" />,
              },
              {
                title: t('home.realTimeAnalysis.title'),
                description: t('home.realTimeAnalysis.desc'),
                icon: <FiSettings className="w-10 h-10 text-green-600 dark:text-green-400" />,
              },
              {
                title: t('home.integrationReady.title'),
                description: t('home.integrationReady.desc'),
                icon: <FiLink2 className="w-10 h-10 text-green-600 dark:text-green-400" />,
              },
              {
                title: t('home.customWorkflows.title'),
                description: t('home.customWorkflows.desc'),
                icon: <FiTrendingUp className="w-10 h-10 text-green-600 dark:text-green-400" />,
              },
            ].map((feature, i) => (
              <div key={i} className="backdrop-blur-md bg-white/80 dark:bg-gray-800/60 p-8 rounded-2xl shadow-lg hover:shadow-xl dark:hover:shadow-xl transition-all border-l-4 border-green-500 dark:border-green-400 hover:scale-105">
                <div className="mb-4">{feature.icon}</div>
                <h4 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">{feature.title}</h4>
                <p className="text-gray-700 dark:text-gray-300">{feature.description}</p>
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
              <div key={i} className="backdrop-blur-md bg-white/80 dark:bg-gray-800/60 p-8 rounded-2xl shadow-lg hover:shadow-xl dark:hover:shadow-xl transition-all border-l-4 border-teal-500 dark:border-teal-400 hover:scale-105">
                <div className="mb-4">{feature.icon}</div>
                <h4 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">{feature.title}</h4>
                <p className="text-gray-700 dark:text-gray-300 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="px-6 md:px-16 py-16 backdrop-blur-sm bg-white/60 dark:bg-gray-900/60 transition-colors duration-300 border-t border-white/20 dark:border-gray-700/30">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white drop-shadow-lg">{t('home.howItWorks')}</h2>

        <div className="grid md:grid-cols-3 gap-10 mt-10">
          {[
            { step: t('home.createProfile'), desc: t('home.createProfileDesc') },
            { step: t('home.takeQuiz'), desc: t('home.takeQuizDesc') },
            { step: t('home.learnWithAI'), desc: t('home.learnWithAIDesc') },
          ].map((step, i) => (
            <div key={i} className="text-center backdrop-blur-md bg-white/70 dark:bg-gray-800/50 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all">
              <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-green-500 dark:from-green-400 dark:to-green-300 bg-clip-text text-transparent mb-4">
                {i + 1}
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{step.step}</h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WHY CHOOSE */}
      <section className="px-6 md:px-16 py-16 backdrop-blur-sm bg-white/60 dark:bg-gray-900/60 transition-colors duration-300 border-t border-white/20 dark:border-gray-700/30">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white drop-shadow-lg">{t('home.whyChoose')}</h2>

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