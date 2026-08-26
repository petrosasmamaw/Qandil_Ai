'use client';

import { generateContentWithFallback } from './geminiClient';

// Fallback high quality Ethiopian curriculum questions for instant load resilience
const getFallbackQuestions = (grade = 10, lang = 'en') => {
  const isAmharic = lang === 'am';

  if (isAmharic) {
    return [
      {
        id: 1,
        question: "የኢትዮጵያ ታላቁ የህዳሴ ግድብ (GERD) የተገነባው በየትኛው ወንዝ ላይ ነው?",
        options: ["አባይ (ዓባይ ወንዝ)", "ተከዜ", "አዋሽ", "ባሮ"],
        correctAnswer: "አባይ (ዓባይ ወንዝ)",
        hint: "የአባይ ወንዝ ዋና ገባር ነው"
      },
      {
        id: 2,
        question: "በፊዚክስ ትምህርት ውስጥ የመጠን (Speed) መለኪያ አሃድ የቱ ነው?",
        options: ["m/s (ሜትር በሰከንድ)", "kg (ኪሎግራም)", "Newton (ኒውተን)", "Joule (ጁል)"],
        correctAnswer: "m/s (ሜትር በሰከንድ)",
        hint: "ርቀት ለጊዜ ሲካፈል የሚገኝ ነው"
      },
      {
        id: 3,
        question: "በሕይወት ጥናት (Biology) ውስጥ 'የሴል የኃይል ማመንጫ' በመባል የሚታወቀው የትኛው የሴል ክፍል ነው?",
        options: ["ማይቶኮንድሪያ (Mitochondria)", "ኒውክሊየስ (Nucleus)", "ራይቦዞም (Ribosome)", "ክሎሮፕላስት (Chloroplast)"],
        correctAnswer: "ማይቶኮንድሪያ (Mitochondria)",
        hint: "ሴሉላር አተነፋፈስ የሚካሄድበት ክፍል ነው"
      },
      {
        id: 4,
        question: "በሒሳብ ትምህርት 3x + 6 = 21 ከሆነ የ x ዋጋ ስንት ነው?",
        options: ["5", "3", "7", "15"],
        correctAnswer: "5",
        hint: "3x = 21 - 6 => 3x = 15"
      },
      {
        id: 5,
        question: "የውሃ ኬሚካላዊ ፎርሙላ የቱ ነው?",
        options: ["H2O", "CO2", "NaCl", "O2"],
        correctAnswer: "H2O",
        hint: "ሁለት ሃይድሮጅን እና አንድ ኦክስጅን አተሞች አሉት"
      }
    ];
  }

  return [
    {
      id: 1,
      question: "Which cell organelle is known as the 'powerhouse of the cell'?",
      options: ["Mitochondria", "Nucleus", "Ribosome", "Endoplasmic Reticulum"],
      correctAnswer: "Mitochondria",
      hint: "It produces ATP for cellular energy."
    },
    {
      id: 2,
      question: "What is the SI unit of Force in Physics?",
      options: ["Newton (N)", "Joule (J)", "Watt (W)", "Pascal (Pa)"],
      correctAnswer: "Newton (N)",
      hint: "Named after Sir Isaac Newton (F = m * a)."
    },
    {
      id: 3,
      question: "In Mathematics, what is the value of x in the equation 2x + 8 = 20?",
      options: ["6", "4", "10", "12"],
      correctAnswer: "6",
      hint: "Subtract 8 from 20, then divide by 2."
    },
    {
      id: 4,
      question: "Which of the following is the chemical formula for water?",
      options: ["H2O", "CO2", "NaCl", "CH4"],
      correctAnswer: "H2O",
      hint: "Composed of two hydrogen atoms and one oxygen atom."
    },
    {
      id: 5,
      question: "The Great Ethiopian Renaissance Dam (GERD) is constructed on which river?",
      options: ["Abay (Blue Nile)", "Awash", "Tekeze", "Baro"],
      correctAnswer: "Abay (Blue Nile)",
      hint: "The major river flowing from Lake Tana."
    }
  ];
};

export const generateLearningLevelQuiz = async (profileData) => {
  const lang = profileData?.preferredLanguage === 'am' ? 'am' : 'en';
  const grade = profileData?.grade || 10;

  try {
    const prompt = `Generate exactly 5 multiple-choice quiz questions for an Ethiopian High School student.
Student Profile:
- Grade: ${grade}
- Study System: ${profileData?.studySystem || 'Ethiopian National Curriculum'}
- Learning Goal: ${profileData?.goal || 'Academic Excellence'}
- Preferred Language: ${lang === 'am' ? 'Amharic' : 'English'}

Questions structure (5 questions total):
Q1 (Foundation): Basic fact recall in Biology or General Science.
Q2 (Foundation): Fundamental unit/concept in Physics.
Q3 (Guided): Basic linear equation in Mathematics.
Q4 (Guided): Chemistry common substance or concept.
Q5 (Analytical): Application question (Ethiopian geography, technology, or science).

Format: JSON array of 5 objects strictly conforming to:
[
  {
    "id": 1,
    "question": "Question text",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "Option A",
    "hint": "Brief helpful hint"
  }
]`;

    const { text } = await generateContentWithFallback({
      contents: prompt,
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    });

    let cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
    const questions = JSON.parse(cleanedText);

    if (Array.isArray(questions) && questions.length >= 3) {
      return questions.slice(0, 5);
    }
    return getFallbackQuestions(grade, lang);
  } catch (error) {
    console.warn('AI Quiz generation fallback used:', error.message);
    return getFallbackQuestions(grade, lang);
  }
};

export const determineLearningLevel = async (profileData, quizAnswers, questions) => {
  const total = questions.length;
  let correctCount = 0;

  // Calculate actual score deterministically
  questions.forEach((q, index) => {
    const studentAns = quizAnswers[index];
    if (
      studentAns &&
      (studentAns.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase() ||
        studentAns.trim().toLowerCase().includes(q.correctAnswer.trim().toLowerCase()))
    ) {
      correctCount++;
    }
  });

  // Calculate level based on performance ratio
  const ratio = correctCount / total;
  let level = 'foundation';
  if (ratio >= 0.8) {
    level = 'analytical';
  } else if (ratio >= 0.6) {
    level = 'independent';
  } else if (ratio >= 0.4) {
    level = 'guided';
  } else {
    level = 'foundation';
  }

  const isAmharic = profileData?.preferredLanguage === 'am';
  const defaultExplanations = {
    analytical: isAmharic
      ? "በጣም ጥሩ ውጤት! ውስብስብ ጥያቄዎችን በራስዎ የመተንተን እና የመፍታት ከፍተኛ ብቃት አሳይተዋል።"
      : "Outstanding performance! You demonstrated high analytical mastery and deep problem-solving skills.",
    independent: isAmharic
      ? "ጥሩ ውጤት! አብዛኛዎቹን የትምህርት ፅንሰ-ሀሳቦች በራስዎ መረዳት እና መተግበር ይችላሉ።"
      : "Great job! You have a solid grasp of key concepts and can study topics independently with confidence.",
    guided: isAmharic
      ? "መልካም ጅምር! ደረጃ በደረጃ የሚሰጡ የኤአይ (AI) ማብራሪያዎች እና ምሳሌዎች እውቀትዎን ያዳብራሉ።"
      : "Good progress! Step-by-step guidance and structured interactive hints will help you excel rapidly.",
    foundation: isAmharic
      ? "ደረጃዎን አውቀናል! መሰረታዊ ፅንሰ-ሀሳቦችን በቀላል እና ግልጽ በሆነ መንገድ በመገንባት እንጀምራለን።"
      : "Welcome to your learning path! We will focus on solidifying foundational concepts and core rules."
  };

  // Fast AI personalized explanation
  try {
    const prompt = `Give a 1-sentence encouraging feedback for a student named ${profileData?.name || 'Student'} who scored ${correctCount}/${total} and was placed in "${level}" level. Language: ${isAmharic ? 'Amharic' : 'English'}. Respond strictly with JSON: {"explanation": "text"}`;

    const { text } = await generateContentWithFallback({
      contents: prompt,
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.3,
      },
    });

    const parsed = JSON.parse(text.replace(/```json\n?|\n?```/g, '').trim());
    return {
      level,
      score: correctCount,
      total,
      explanation: parsed.explanation || defaultExplanations[level],
    };
  } catch {
    return {
      level,
      score: correctCount,
      total,
      explanation: defaultExplanations[level],
    };
  }
};
