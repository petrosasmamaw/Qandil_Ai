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
            backgroundImage: `url('https://images.openai.com/static-rsc-4/UhK-ZnGnaOc26fOHcPEMngdrJMi0lBmw_eKNkaDh38qqO6xopIWrT3GyMD_7F0bUEwvEgsSxHAA7F9eZ0sIsr6zwzCbSZXRwDuam2ZAsT_4kprqEa4D6b_95yr-58SC2Fzcww7u8K9AFRoRHVUJ2ItNncyjWPfYYxDDhB96QIwwOEW1mvB1bi6CkXIYSZjje?purpose=inline')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            filter: 'blur(8px)',
            transform: 'scale(1.05)', // Prevent white edges after blurring
          }}
        />
      )}

      {/* HERO */}
      <section className="text-center px-6 py-20 relative">
        <div className="relative z-10 light-box rounded-3xl p-10 max-w-5xl mx-auto border shadow-sm">
          <h1 className="text-5xl font-bold mb-4">
            {t('home.hero.title')} <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-500">{t('home.hero.titleHighlight')}</span>
          </h1>
          <p className="text-lg mb-6 max-w-2xl mx-auto">{t('home.hero.tagline')}</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link href="/profile" className="px-6 py-3 rounded-xl border bg-white/10 hover:bg-white/20 transition font-semibold">
              {t('home.hero.startJourney')}
            </Link>
            <Link href="/features" className="px-6 py-3 rounded-xl border bg-white/10 hover:bg-white/20 transition font-semibold">
              {t('home.hero.exploreFeatures')}
            </Link>
          </div>
        </div>
      </section>

      {/* MAIN FEATURES */}
      <section className="grid md:grid-cols-3 gap-8 px-6 md:px-16 py-16">
        {[
          { title: t('home.features.title1'), icon: <FiCpu className="w-8 h-8" />, desc: t('home.features.desc1'), link: "/ai-assistance" },
          { title: t('home.features.title2'), icon: <FiEdit2 className="w-8 h-8" />, desc: t('home.features.desc2'), link: "/notes" },
          { title: t('home.features.title3'), icon: <FiClipboard className="w-8 h-8" />, desc: t('home.features.desc3'), link: "/assignment-guide" }
        ].map((item, i) => (
          <Link href={item.link} key={i}>
            <div className="light-box p-6 rounded-2xl border hover:scale-105 transition h-full">
              <div className="text-green-600 mb-3">{item.icon}</div>
              <h3 className="text-xl font-semibold mt-3">{item.title}</h3>
              <p className="text-sm mt-2 opacity-80">{item.desc}</p>
            </div>
          </Link>
        ))}
      </section>

      {/* COMPREHENSIVE FEATURES */}
      <section className="px-6 md:px-16 py-16 border-t border-black/10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">{t('home.powerfulFeatures')}</h2>
          <p className="text-sm opacity-70">{t('home.discoverFeatures')}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { title: t('home.nlp.title'), desc: t('home.nlp.desc'), icon: <FiMessageSquare /> },
            { title: t('home.multiLanguage.title'), desc: t('home.multiLanguage.desc'), icon: <FiGlobe /> },
            { title: t('home.machineLearning.title'), desc: t('home.machineLearning.desc'), icon: <FiBarChart2 /> },
            { title: t('home.realTimeAnalysis.title'), desc: t('home.realTimeAnalysis.desc'), icon: <FiSettings /> },
            { title: t('home.integrationReady.title'), desc: t('home.integrationReady.desc'), icon: <FiLink2 /> },
            { title: t('home.customWorkflows.title'), desc: t('home.customWorkflows.desc'), icon: <FiTrendingUp /> }
          ].map((f, i) => (
            <div key={i} className="light-box p-6 rounded-2xl border hover:scale-105 transition border-l-4 border-l-green-500">
              <div className="text-green-600 text-2xl">{f.icon}</div>
              <h4 className="font-semibold mt-3">{f.title}</h4>
              <p className="text-sm mt-1 opacity-80">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* STUDENT SPECIFIC */}
      <section className="px-6 md:px-16 py-16 border-t border-black/10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">{t('home.personalizedForStudents')}</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { title: t('home.aiQuiz.title'), desc: t('home.aiQuiz.desc'), icon: <FiMessageSquare /> },
            { title: t('home.notesGeneration.title'), desc: t('home.notesGeneration.desc'), icon: <FiFileText /> },
            { title: t('home.assignmentGuidance.title'), desc: t('home.assignmentGuidance.desc'), icon: <FiTrendingUp /> },
            { title: t('home.imageAnalysis.title'), desc: t('home.imageAnalysis.desc'), icon: <FiImage /> }
          ].map((f, i) => (
            <div key={i} className="light-box p-6 rounded-2xl border hover:scale-105 transition border-l-4 border-l-teal-500">
              <div className="text-teal-600 text-2xl">{f.icon}</div>
              <h4 className="font-semibold mt-3">{f.title}</h4>
              <p className="text-sm mt-1 opacity-80">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="px-6 md:px-16 py-16 border-t border-black/10">
        <h2 className="text-3xl font-bold text-center mb-10">{t('home.howItWorks')}</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { step: t('home.createProfile'), desc: t('home.createProfileDesc') },
            { step: t('home.takeQuiz'), desc: t('home.takeQuizDesc') },
            { step: t('home.learnWithAI'), desc: t('home.learnWithAIDesc') }
          ].map((s, i) => (
            <div key={i} className="light-box p-6 rounded-xl border text-center hover:scale-105 transition">
              <span className="text-3xl font-bold text-green-500 block mb-2">{i + 1}</span>
              <h3 className="font-semibold">{s.step}</h3>
              <p className="text-sm mt-1 opacity-80">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WHY CHOOSE */}
      <section className="px-6 md:px-16 py-16 border-t border-black/10">
        <h2 className="text-3xl font-bold text-center mb-10">{t('home.whyChoose')}</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: t('home.trulyPersonalized'), desc: t('home.trulyPersonalizedDesc') },
            { title: t('home.builtForEthiopia'), desc: t('home.builtForEthiopiaDesc') },
            { title: t('home.learnByUnderstanding'), desc: t('home.learnByUnderstandingDesc') }
          ].map((item, i) => (
            <div key={i} className="light-box p-8 rounded-2xl border hover:scale-105 transition border-l-4 border-l-blue-500">
              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-sm leading-relaxed opacity-80">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WHO IT'S FOR */}
      <section className="px-6 md:px-16 py-16 border-t border-black/10">
        <h2 className="text-3xl font-bold text-center mb-10">{t('home.whoItFor')}</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { user: t('home.highSchool'), desc: t('home.highSchoolDesc') },
            { user: t('home.examPrep'), desc: t('home.examPrepDesc') },
            { user: t('home.independentLearners'), desc: t('home.independentLearnersDesc') }
          ].map((item, i) => (
            <div key={i} className="light-box p-8 rounded-2xl border hover:scale-105 transition border-l-4 border-l-purple-500 text-center">
              <h3 className="font-semibold text-lg mb-2">{item.user}</h3>
              <p className="text-sm leading-relaxed opacity-80">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center px-6 py-20 border-t border-black/10">
        <h2 className="text-4xl font-bold mb-4">{t('home.learnSmarter')}</h2>
        <p className="text-sm mb-6 opacity-80">{t('home.joinStudentsEthiopia')}</p>
        <Link href="/profile">
          <button className="px-8 py-3 rounded-xl border light-box hover:scale-105 transition font-bold">
            {t('home.getStarted')}
          </button>
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="text-center py-8 border-t border-black/10 text-sm">
        © {new Date().getFullYear()} QandilAI. {t('home.empoweringStudents')}
      </footer>

    </main>
  );
}