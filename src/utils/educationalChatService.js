import { sendChatMessageWithFallback } from './geminiClient';

export const createEducationalChatSession = (studentProfile, appLanguage = 'eng') => {
  if (!studentProfile) {
    return `You are a professional and adaptive educational mentor here to help students with their academic questions. Please provide helpful, clear explanations. Respond in ${appLanguage === 'amh' ? 'Amharic (Ethiopian)' : 'English'}.`;
  }
  
  const preferredLang = appLanguage === 'amh' ? 'Amharic (Ethiopian)' : studentProfile.preferredLanguage || 'English';

  const systemPrompt = `You are a professional and adaptive educational mentor. Your identity is built on being a supportive guide for ${studentProfile.name}, a Grade ${studentProfile.grade} student currently focusing on a ${studentProfile.studySystem} approach to reach the goal of ${studentProfile.goal}.

STUDENT CONTEXT:
- Current Level: ${studentProfile.level}
- Target Goal: ${studentProfile.goal}
- Study Method: ${studentProfile.studySystem}
- Primary Language: ${preferredLang}

TEACHING PHILOSOPHY:
Your primary mission is to explain complex academic concepts using clear language and deeply contextualized local examples. IT IS MANDATORY that for EVERY single question or concept you explain, you MUST provide a relevant local analogy specifically from the Amhara Region of Ethiopia. This is an absolute rule: DO NOT answer any question without including an analogy from the Amhara region (for example: mentioning Bahir Dar, Lake Tana, the Blue Nile falls, Gondar castles, Lalibela, Simien Mountains, local farming like Teff, or specific cultural practices of the region).

ADAPTATION RULES:
1. Level Scaling: 
   - Foundation: Act as a patient teacher using simple vocabulary and step by step logic.
   - Guided: Act as a coach providing a framework while encouraging the student to fill in details.
   - Independent: Act as a consultant providing hints and high level summaries.
   - Analytical: Act as a peer challenger pushing for deep logic and system wide thinking.

2. Goal Alignment:
   - If the goal is Pass Exam, focus on high yield topics and time management.
   - If the goal is Deep Understanding, prioritize the why behind the facts.

STRICT FORMATTING AND CONTENT BOUNDARIES:
- USE PLAIN TEXT ONLY. 
- ABSOLUTELY NO MARKDOWN. Do not use asterisks, hashtags, underscores, or dashes for lists.
- NO BULLET POINTS. Use full, natural sentences and clear paragraph breaks.
- MANDATORY LOCAL ANALOGY: You must include at least one clear analogy relating to the Amhara Region (like Bahir Dar, Gondar, Lake Tana, Lalibela, etc.) in every single response where you teach or explain something.
- Academic Focus: Only discuss education, career skills, and learning. Politely decline off-topic requests.
- Language Requirement: You MUST respond primarily in ${preferredLang}. This is a strict requirement for all your answers and explanations.

Tone: Be encouraging, respectful, and culturally grounded. 

Start now by greeting the student warmly. Mention your excitement to help them reach their goal of ${studentProfile.goal} and ask which specific subject or topic they would like to explore today.`;
  return systemPrompt;
};

export const sendChatMessage = async (studentProfile, conversationHistory, userMessage, appLanguage = 'eng') => {
  try {
    if (!studentProfile) {
      throw new Error('Student profile not loaded. Please complete your profile setup first.');
    }

    const systemPrompt = createEducationalChatSession(studentProfile, appLanguage);

    // Format conversation history for the API
    const formattedHistory = conversationHistory.map(msg => ({
      role: msg.sender === 'ai' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    const { text } = await sendChatMessageWithFallback({
      systemInstruction: systemPrompt,
      history: formattedHistory,
      userMessage,
      generationConfig: {
        maxOutputTokens: 1024,
        temperature: 0.7,
      },
    });

    return {
      success: true,
      message: text,
    };
  } catch (error) {
    console.error('Error sending chat message:', error);
    throw new Error('Failed to send message: ' + error.message);
  }
};

export const getInitialGreeting = (studentProfile, appLanguage = 'eng') => {
  if (!studentProfile) {
    return appLanguage === 'amh'
      ? `👋 እንኳን ወደ ልዩ የትምህርት አጋዥዎ በደህና መጡ!

በትምህርትዎ ልረዳዎ እዚህ መጥቻለሁ። እባክዎ የመማሪያ ልምድዎን ከፍላጎትዎ ጋር ማስተካከል እንድችል መገለጫዎን ሙሉ በሙሉ ያጠናቅቁ።

ዛሬ በምን ርዕስ ላይ እርዳታ ይፈልጋሉ?`
      : `👋 Welcome to your personalized learning assistant!

I'm here to help you with your studies. Please complete your profile so I can tailor the learning experience to your needs.

What subject or topic would you like help with today?`;
  }

  if (appLanguage === 'amh') {
    const studySystemAmh = {
      'theoretical': 'ንድፈ-ሀሳባዊ',
      'practical': 'ተግባራዊ',
      'visual': 'ዕይታ-ተኮር'
    }[studentProfile.studySystem] || studentProfile.studySystem;

    const levelAmh = {
      'foundation': 'መሰረታዊ (Foundation)',
      'guided': 'የሚመራ (Guided)',
      'independent': 'ራሱን የቻለ (Independent)',
      'analytical': 'ትንታኔያዊ (Analytical)'
    }[studentProfile.level?.toLowerCase()] || studentProfile.level;

    const goalAmh = {
      'pass_exam': 'ፈተና ማለፍ',
      'deep_understanding': 'ጥልቅ ግንዛቤ ማግኘት'
    }[studentProfile.goal] || studentProfile.goal?.replace(/_/g, ' ');

    return `ሰላም ${studentProfile.name}! 👋 እንኳን ወደ ልዩ የትምህርት አጋዥዎ በደህና መጡ።

በራስዎ የመማር ዘዴ መሰረት በትምህርትዎ ልረዳዎ ዝግጁ ነኝ። ስለ እርስዎ የተረዳሁት፡
- የክፍል ደረጃ፡ ${studentProfile.grade}ኛ ክፍል
- የመማር ዘዴዎ፡ ${studySystemAmh}
- የአሁን የትምህርት ደረጃዎ፡ ${levelAmh}
- ዋና ግብዎ፡ ${goalAmh}

ዛሬ በየትኛው ትምህርት ወይም ርዕስ ላይ ልረዳዎ እችላለሁ? ማንኛውንም ጥያቄ ለመጠየቅ፣ ማብራሪያዎችን ለመፈለግ፣ ወይም ጥያቄዎችን አብረን ለመስራት ነፃ ይሁኑ!`;
  }

  return `Hello ${studentProfile.name}! 👋 Welcome to your personalized learning assistant.

I'm here to help you with your studies tailored to your learning style. I understand that you:
- Are in Grade ${studentProfile.grade}
- Prefer a ${studentProfile.studySystem} study approach
- Have a learning level of ${studentProfile.level}
- Your goal is to ${studentProfile.goal.replace(/_/g, ' ')}

What subject or topic would you like help with today? Feel free to ask questions, request explanations, or work through problems together!`;
};
