import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

export const processDocument = async (file, studentProfile) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });

    // Read file as base64
    const fileData = await readFileAsBase64(file);
    const mimeType = getMimeType(file.type);

    // Create prompt based on student profile
    const prompt = createDocumentPrompt(studentProfile);

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
    const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });

    // Create prompt based on student profile
    const prompt = createDocumentPrompt(studentProfile);

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
  return `You are an educational assistant helping a student named ${studentProfile.name} (Grade ${studentProfile.grade}).

Student Profile:
- Learning Level: ${studentProfile.level}
- Study System: ${studentProfile.studySystem}
- Learning Goal: ${studentProfile.goal}

Please analyze this document and create study notes according to these requirements:

1. Extract key concepts and main points from the document
2. Create clear, plain text notes without markdown or special characters
3. Organize the information in a logical way
4. Adapt the complexity based on ${studentProfile.level} learning level:
   - Foundation level: Very simple language, step by step
   - Guided level: Clear structure with guidance
   - Independent level: Key points with hints
   - Analytical level: Deep concepts and analysis

5. Include:
   - Summary of main topics
   - Key concepts explained simply
   - Important points to remember
   - Examples relevant to ${studentProfile.goal}
   - Study tips for ${studentProfile.studySystem} approach

6. Format as plain text only - NO markdown, NO special characters, NO bullet points
7. Write in natural sentences and paragraphs

Please provide comprehensive study notes now:`;
};
