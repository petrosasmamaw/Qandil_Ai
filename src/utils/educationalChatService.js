import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

export const createEducationalChatSession = (studentProfile) => {
  const systemPrompt = `You are a professional and adaptive educational mentor. Your identity is built on being a supportive guide for ${studentProfile.name}, a Grade ${studentProfile.grade} student currently focusing on a ${studentProfile.studySystem} approach to reach the goal of ${studentProfile.goal}.

STUDENT CONTEXT:
- Current Level: ${studentProfile.level}
- Target Goal: ${studentProfile.goal}
- Study Method: ${studentProfile.studySystem}
- Primary Language: ${studentProfile.preferredLanguage}

TEACHING PHILOSOPHY:
Your primary mission is to explain complex academic concepts using clear language and local Ethiopian context. Whenever you explain a difficult theory, use analogies related to Bahir Dar. For instance, compare the flow of information to the Blue Nile river, the organization of data to the stalls at the local markets, or the structure of a project to the beautiful palm trees lining the city streets. 

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
- Academic Focus: Only discuss education, career skills, and learning. Politely decline off-topic requests.
- Language: Primarily respond in ${studentProfile.preferredLanguage} while maintaining the professional mentor persona.

Tone: Be encouraging, respectful, and culturally grounded. 

Start now by greeting the student warmly. Mention your excitement to help them reach their goal of ${studentProfile.goal} and ask which specific subject or topic they would like to explore today.`;
  return systemPrompt;
};

export const sendChatMessage = async (studentProfile, conversationHistory, userMessage) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });

    const systemPrompt = createEducationalChatSession(studentProfile);

    // Format conversation history for the API
    // Filter to only include user messages (exclude AI greeting for first message validation)
    const messages = conversationHistory
      .filter(msg => msg.sender === 'user') // Only user messages for history
      .map(msg => ({
        role: 'user',
        parts: [{ text: msg.content }]
      }));

    // Add current user message
    messages.push({
      role: 'user',
      parts: [{ text: userMessage }]
    });

    const chat = model.startChat({
      history: messages.slice(0, -1), // Previous user messages only
      generationConfig: {
        maxOutputTokens: 1024,
        temperature: 0.7,
      },
    });

    const response = await chat.sendMessage(userMessage);
    const responseText = response.response.text();

    return {
      success: true,
      message: responseText,
    };
  } catch (error) {
    console.error('Error sending chat message:', error);
    throw new Error('Failed to send message: ' + error.message);
  }
};

export const getInitialGreeting = (studentProfile) => {
  return `Hello ${studentProfile.name}! 👋 Welcome to your personalized learning assistant.

I'm here to help you with your studies tailored to your learning style. I understand that you:
- Are in Grade ${studentProfile.grade}
- Prefer a ${studentProfile.studySystem} study approach
- Have a learning level of ${studentProfile.level}
- Your goal is to ${studentProfile.goal.replace(/_/g, ' ')}

What subject or topic would you like help with today? Feel free to ask questions, request explanations, or work through problems together!`;
};
