'use client';

import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";
import { useEffect, useState } from "react";
import { 
  FiCpu, FiEdit2, FiClipboard, FiMessageSquare, FiGlobe, 
  FiBarChart2, FiSettings, FiLink2, FiTrendingUp, FiImage, FiFileText
} from "react-icons/fi";

export default function Home() {
  const { t } = useTranslation();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const dark = document.documentElement.classList.contains('dark');
    setIsDark(dark);

    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const backgroundStyle = {
    '--light-bg-image': "url('https://cdn.vectorstock.com/i/500p/87/24/pastel-pink-and-blue-blur-backdrop-vector-63408724.jpg')",
  };

  return (
    <main className="light-image-bg min-h-screen transition-colors duration-300 relative z-0" style={backgroundStyle}>
      {/* DARK MODE BACKGROUND IMAGE WITH BLUR ONLY */}
      {isDark && (
        <div 
          className="fixed inset-0 -z-10 pointer-events-none"
          style={{
            backgroundImage: `url('https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDI0LTAxL3Jhd3BpeGVsX29mZmljZV8zNF9taW5pbWFsX2Fic3RyYWN0X2JsdWVfYW5kX3B1cnBsZV9uZW9uX3dhdnlfZ182ZWQyZmJmMS05ZWMzLTQxNmItOWY4My0yZmJmNThjOWUyNzVfMS5qcGc.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            filter: 'blur(8px)',
            transform: 'scale(1.05)', // Prevent white edges after blurring
          }}
        />
      )}

      {/* HERO */}
      <section className="text-center px-4 sm:px-6 md:px-8 py-10 sm:py-14 md:py-20 relative">
        <div className="relative z-10 light-box rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 max-w-5xl mx-auto border shadow-sm">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
            {t('home.hero.title')} <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-500">{t('home.hero.titleHighlight')}</span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg mb-4 sm:mb-6 max-w-2xl mx-auto">{t('home.hero.tagline')}</p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 flex-wrap">
            <Link href="/profile" className="px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base rounded-lg sm:rounded-xl border bg-white/10 hover:bg-white/20 transition font-semibold">
              {t('home.hero.startJourney')}
            </Link>
            <Link href="/features" className="px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base rounded-lg sm:rounded-xl border bg-white/10 hover:bg-white/20 transition font-semibold">
              {t('home.hero.exploreFeatures')}
            </Link>
          </div>
        </div>
      </section>

      {/* MAIN FEATURES */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-10 sm:py-14 md:py-16">
        {[
          { title: t('home.features.title1'), icon: <FiCpu className="w-6 h-6 sm:w-8 sm:h-8" />, desc: t('home.features.desc1'), link: "/ai-assistance" },
          { title: t('home.features.title2'), icon: <FiEdit2 className="w-6 h-6 sm:w-8 sm:h-8" />, desc: t('home.features.desc2'), link: "/notes" },
          { title: t('home.features.title3'), icon: <FiClipboard className="w-6 h-6 sm:w-8 sm:h-8" />, desc: t('home.features.desc3'), link: "/assignment-guide" }
        ].map((item, i) => (
          <Link href={item.link} key={i}>
            <div className="light-box p-5 sm:p-6 rounded-xl sm:rounded-2xl border hover:scale-105 transition h-full">
              <div className="text-green-600 mb-2 sm:mb-3">{item.icon}</div>
              <h3 className="text-lg sm:text-xl font-semibold mt-2 sm:mt-3">{item.title}</h3>
              <p className="text-xs sm:text-sm mt-2 opacity-80">{item.desc}</p>
            </div>
          </Link>
        ))}
      </section>

      {/* COMPREHENSIVE FEATURES */}
      <section className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-10 sm:py-14 md:py-16 border-t border-black/10">
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">{t('home.powerfulFeatures')}</h2>
          <p className="text-xs sm:text-sm opacity-70">{t('home.discoverFeatures')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {[
            { title: t('home.nlp.title'), desc: t('home.nlp.desc'), icon: <FiMessageSquare /> },
            { title: t('home.multiLanguage.title'), desc: t('home.multiLanguage.desc'), icon: <FiGlobe /> },
            { title: t('home.machineLearning.title'), desc: t('home.machineLearning.desc'), icon: <FiBarChart2 /> },
            { title: t('home.realTimeAnalysis.title'), desc: t('home.realTimeAnalysis.desc'), icon: <FiSettings /> },
            { title: t('home.integrationReady.title'), desc: t('home.integrationReady.desc'), icon: <FiLink2 /> },
            { title: t('home.customWorkflows.title'), desc: t('home.customWorkflows.desc'), icon: <FiTrendingUp /> }
          ].map((f, i) => (
            <div key={i} className="light-box p-5 sm:p-6 rounded-xl sm:rounded-2xl border hover:scale-105 transition border-l-4 border-l-green-500">
              <div className="text-xl sm:text-2xl text-green-600">{f.icon}</div>
              <h4 className="font-semibold text-sm sm:text-base mt-2 sm:mt-3">{f.title}</h4>
              <p className="text-xs sm:text-sm mt-1 sm:mt-2 opacity-80">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* STUDENT SPECIFIC */}
      <section className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-10 sm:py-14 md:py-16 border-t border-black/10">
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">{t('home.personalizedForStudents')}</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {[
            { title: t('home.aiQuiz.title'), desc: t('home.aiQuiz.desc'), icon: <FiMessageSquare /> },
            { title: t('home.notesGeneration.title'), desc: t('home.notesGeneration.desc'), icon: <FiFileText /> },
            { title: t('home.assignmentGuidance.title'), desc: t('home.assignmentGuidance.desc'), icon: <FiTrendingUp /> },
            { title: t('home.imageAnalysis.title'), desc: t('home.imageAnalysis.desc'), icon: <FiImage /> }
          ].map((f, i) => (
            <div key={i} className="light-box p-5 sm:p-6 rounded-xl sm:rounded-2xl border hover:scale-105 transition border-l-4 border-l-teal-500">
              <div className="text-xl sm:text-2xl text-teal-600">{f.icon}</div>
              <h4 className="font-semibold text-sm sm:text-base mt-2 sm:mt-3">{f.title}</h4>
              <p className="text-xs sm:text-sm mt-1 sm:mt-2 opacity-80">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-10 sm:py-14 md:py-16 border-t border-black/10">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-10 md:mb-12">{t('home.howItWorks')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {[
            { step: t('home.createProfile'), desc: t('home.createProfileDesc') },
            { step: t('home.takeQuiz'), desc: t('home.takeQuizDesc') },
            { step: t('home.learnWithAI'), desc: t('home.learnWithAIDesc') }
          ].map((s, i) => (
            <div key={i} className="light-box p-5 sm:p-6 rounded-lg sm:rounded-xl border text-center hover:scale-105 transition">
              <span className="text-2xl sm:text-3xl font-bold text-green-500 block mb-2">{i + 1}</span>
              <h3 className="font-semibold text-sm sm:text-base">{s.step}</h3>
              <p className="text-xs sm:text-sm mt-1 opacity-80">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WHY CHOOSE */}
      <section className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-10 sm:py-14 md:py-16 border-t border-black/10">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-10 md:mb-12">{t('home.whyChoose')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {[
            { title: t('home.trulyPersonalized'), desc: t('home.trulyPersonalizedDesc') },
            { title: t('home.builtForEthiopia'), desc: t('home.builtForEthiopiaDesc') },
            { title: t('home.learnByUnderstanding'), desc: t('home.learnByUnderstandingDesc') }
          ].map((item, i) => (
            <div key={i} className="light-box p-6 sm:p-8 rounded-lg sm:rounded-2xl border hover:scale-105 transition border-l-4 border-l-blue-500">
              <h3 className="font-semibold text-base sm:text-lg mb-2">{item.title}</h3>
              <p className="text-xs sm:text-sm leading-relaxed opacity-80">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WHO IT'S FOR */}
      <section className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-10 sm:py-14 md:py-16 border-t border-black/10">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-10 md:mb-12">{t('home.whoItFor')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {[
            { user: t('home.highSchool'), desc: t('home.highSchoolDesc') },
            { user: t('home.examPrep'), desc: t('home.examPrepDesc') },
            { user: t('home.independentLearners'), desc: t('home.independentLearnersDesc') }
          ].map((item, i) => (
            <div key={i} className="light-box p-6 sm:p-8 rounded-lg sm:rounded-2xl border hover:scale-105 transition border-l-4 border-l-purple-500 text-center">
              <h3 className="font-semibold text-base sm:text-lg mb-2">{item.user}</h3>
              <p className="text-xs sm:text-sm leading-relaxed opacity-80">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center px-4 sm:px-6 md:px-8 py-14 sm:py-20 border-t border-black/10">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">{t('home.learnSmarter')}</h2>
        <p className="text-xs sm:text-sm mb-4 sm:mb-6 opacity-80">{t('home.joinStudentsEthiopia')}</p>
        <Link href="/profile">
          <button className="px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base rounded-lg sm:rounded-xl border light-box hover:scale-105 transition font-bold">
            {t('home.getStarted')}
          </button>
        </Link>
      </section>

    </main>
  );
}