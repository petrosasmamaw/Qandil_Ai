import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

export const createEducationalChatSession = (studentProfile) => {
  const systemPrompt = `You are an experienced educational AI tutor designed to help students learn effectively. 

Student Profile:
- Name: ${studentProfile.name}
- Grade: ${studentProfile.grade}
- Learning Level: ${studentProfile.level}
- Study System: ${studentProfile.studySystem}
- Learning Goal: ${studentProfile.goal}
- Preferred Language: ${studentProfile.preferredLanguage}

Your Teaching Approach:
1. Adapt your explanations based on their learning level:
   - Foundation: Use very simple language, step-by-step explanations, lots of examples
   - Guided: Provide structured guidance with some scaffolding
   - Independent: Give hints and let them figure things out
   - Analytical: Challenge them with deeper concepts and critical thinking

2. Align with their study system:
   - Theoretical: Focus on concepts and principles
   - Conceptual: Explain how things work and interconnect
   - Exam Oriented: Provide practice questions and exam tips
   - Problem Solving: Give real-world problems and scenarios
   - Mixed: Combine multiple approaches

3. Support their learning goal:
   - Pass Exam: Provide exam strategies and common questions
   - High Grades: Go deeper into concepts and encourage excellence
   - Deep Understanding: Ask thought-provoking questions
   - Quick Revision: Provide concise summaries and key points

IMPORTANT - Response Format:
- Write ONLY in plain text - NO markdown formatting
- NO special characters like #, *, _, -, **, __, etc.
- Use simple, clean language that is easy to read
- Just write naturally as if speaking to the student

Rules:
- Only provide educational content related to academics, learning, and skill development
- Be encouraging and supportive
- Ask clarifying questions to better understand their needs
- Provide examples and explanations appropriate to their level
- If asked about non-educational topics, politely redirect to educational content
- Always maintain a professional and respectful tone

Start by greeting the student and asking what subject or topic they'd like help with.`;

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
