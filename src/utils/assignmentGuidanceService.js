import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

export const generateAssignmentGuidance = async (file, studentProfile) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });

    // Read file as base64
    const fileData = await readFileAsBase64(file);
    const mimeType = getMimeType(file.type);

    // Create guidance prompt based on student profile
    const prompt = createGuidancePrompt(studentProfile);

    // Upload file and process
    const response = await model.generateContent([
      {
        inlineData: {
          data: fileData,
          mimeType: mimeType,
        },
      },
      prompt,
    ]);

    const responseText = response.response.text();

    return {
      success: true,
      guidance: responseText,
      fileName: file.name,
      processedAt: new Date(),
    };
  } catch (error) {
    console.error('Error generating guidance:', error);
    throw new Error('Failed to generate guidance: ' + error.message);
  }
};

export const generateAssignmentGuidanceFromText = async (text, title, studentProfile) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });

    // Create guidance prompt based on student profile
    const prompt = createGuidancePrompt(studentProfile);

    // Process text content
    const response = await model.generateContent([
      {
        text: text,
      },
      prompt,
    ]);

    const responseText = response.response.text();

    return {
      success: true,
      guidance: responseText,
      fileName: title || 'Assignment Guidance',
      processedAt: new Date(),
    };
  } catch (error) {
    console.error('Error generating guidance from text:', error);
    throw new Error('Failed to generate guidance: ' + error.message);
  }
};

const readFileAsBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const getMimeType = (fileType) => {
  if (fileType.includes('pdf')) {
    return 'application/pdf';
  } else if (fileType.includes('word') || fileType.includes('document')) {
    return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  }
  return fileType;
};

const createGuidancePrompt = (studentProfile) => {
  return `You are an experienced assignment guidance counselor. Your role is to GUIDE the student on HOW to approach and complete their assignment, NOT to do the assignment for them.

Student Profile:
- Name: ${studentProfile.name}
- Grade: ${studentProfile.grade}
- Learning Level: ${studentProfile.level}
- Study System: ${studentProfile.studySystem}
- Learning Goal: ${studentProfile.goal}

Based on the assignment PDF/Document provided, create personalized GUIDANCE for this student.

IMPORTANT - Your Job is to GUIDE, NOT to DO the assignment:
- Help them understand what is being asked
- Break down the assignment into manageable steps
- Suggest an approach or strategy
- Highlight key things to focus on
- Ask guiding questions to help them think
- Suggest resources or techniques
- Do NOT provide answers or complete solutions
- Do NOT do parts of the assignment

Adapt your guidance based on their learning level:
- Foundation level: Very clear step-by-step breakdown, suggest simpler approaches
- Guided level: Clear structure with some examples, provide scaffolding
- Independent level: Key points and hints, let them figure details
- Analytical level: Challenge them with deeper thinking, discuss concepts

Align with their study system:
- Theoretical: Focus on understanding the concepts behind the assignment
- Conceptual: Explain how different ideas connect
- Exam Oriented: Link assignment to exam preparation
- Problem Solving: Focus on practical application and real-world connections
- Mixed: Combine multiple approaches

Support their learning goal:
- Pass Exam: Focus on meeting requirements effectively
- High Grades: Suggest ways to go above and beyond
- Deep Understanding: Encourage deeper exploration
- Quick Revision: Provide efficient shortcuts and summaries

Format your guidance:
- Write ONLY in plain text - NO markdown formatting
- NO special characters like #, *, _, -, **, __, etc.
- NO bullet points or numbered lists - use simple sentences instead
- NO code blocks or backticks
- Use natural sentences and paragraphs
- Be encouraging and supportive

Structure your response:
1. Brief assignment summary (what are they being asked to do)
2. Key requirements they should focus on
3. Suggested approach or strategy
4. Step-by-step guidance on how to tackle it
5. Important points to remember
6. Questions to help them think critically
7. Tips specific to their learning style and goals

Now provide personalized assignment guidance:`;
};
