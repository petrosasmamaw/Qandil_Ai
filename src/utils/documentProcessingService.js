import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

export const processDocument = async (file, studentProfile) => {
  try {
    const systemPrompt = createDocumentPrompt(studentProfile);
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-3.1-flash-lite-preview',
      systemInstruction: systemPrompt
    });

    // Read file as base64
    const fileData = await readFileAsBase64(file);
    const mimeType = getMimeType(file.type);

    // Upload file and process
    const response = await model.generateContent([
      {
        inlineData: {
          data: fileData,
          mimeType: mimeType,
        },
      },
      "Please process this document into study notes based on my profile.",
    ]);

    const responseText = response.response.text();

    return {
      success: true,
      notes: responseText,
      fileName: file.name,
      processedAt: new Date(),
    };
  } catch (error) {
    console.error('Error processing document:', error);
    throw new Error('Failed to process document: ' + error.message);
  }
};

export const processTextContent = async (text, title, studentProfile) => {
  try {
    const systemPrompt = createDocumentPrompt(studentProfile);
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-3.1-flash-lite-preview',
      systemInstruction: systemPrompt
    });

    // Process text content
    const response = await model.generateContent([
      {
        text: text,
      },
      "Please process this text into study notes based on my profile.",
    ]);

    const responseText = response.response.text();

    return {
      success: true,
      notes: responseText,
      fileName: title || 'Study Notes',
      processedAt: new Date(),
    };
  } catch (error) {
    console.error('Error processing text content:', error);
    throw new Error('Failed to process text: ' + error.message);
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

const createDocumentPrompt = (studentProfile) => {
  return `You are a world-class adaptive tutor specialized in the ${studentProfile.studySystem} system. Your student is ${studentProfile.name}, a Grade ${studentProfile.grade} learner at the ${studentProfile.level} level.

CONTEXT:
Student Goal: ${studentProfile.goal}
Learning Level: ${studentProfile.level}

TASK:
Analyze the attached document and transform it into study notes. You must adapt your vocabulary, sentence complexity, and instructional scaffolding to match the "${studentProfile.level}" profile. 

ADAPTABILITY GUIDELINES:
- Foundation: Use high-frequency words and "check-in" sentences.
- Guided: Use transitional phrases that lead the student from one idea to the next.
- Independent: Highlight "what" to know and provide "how" to think hints.
- Analytical: Focus on "why" and "what if," connecting the content to broader systems.

LOCAL ANALOGY REQUIREMENT:
To make the core concept of this document stick, you MUST include an analogy related to the city of Bahir Dar, Ethiopia. Use the Blue Nile (Abay), Lake Tana, the palm-lined streets, or the local boat transport to explain a complex mechanism or structure found in the text.

CONSTRAINTS:
- ABSOLUTELY NO MARKDOWN (no stars, no hashes, no brackets).
- NO BULLET POINTS or special characters.
- Use only plain text and natural paragraphs.
- Focus on flow and narrative structure.

Include:
1. A summary of main topics.
2. Key concepts explained through the Bahir Dar analogy.
3. Critical points for the ${studentProfile.studySystem} exams.
4. Actionable study tips tailored to their goal.

Write the comprehensive study notes now as a seamless, plain-text narrative:`;
};