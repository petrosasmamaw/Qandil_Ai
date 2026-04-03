import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

export const analyzeImage = async (imageFile, studentProfile) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });

    // Read file as base64
    const fileData = await readFileAsBase64(imageFile);
    const mimeType = imageFile.type;

    // Create analysis prompt based on student profile
    const prompt = createAnalysisPrompt(studentProfile);

    // Analyze image
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
      analysis: responseText,
      fileName: imageFile.name,
      analyzedAt: new Date(),
    };
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw new Error('Failed to analyze image: ' + error.message);
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

const createAnalysisPrompt = (studentProfile) => {
  return `You are an educational assistant helping a student named ${studentProfile.name} (Grade ${studentProfile.grade}).

Student Profile:
- Learning Level: ${studentProfile.level}
- Study System: ${studentProfile.studySystem}
- Learning Goal: ${studentProfile.goal}

Please analyze this image and provide an educational description according to these requirements:

1. Identify what is shown in the image
2. Provide educational context and relevance
3. Explain key concepts or ideas illustrated in the image
4. Adapt the complexity based on ${studentProfile.level} learning level:
   - Foundation level: Very simple explanations, focus on basics
   - Guided level: Clear structure with guidance on understanding
   - Independent level: Key points with hints for exploration
   - Analytical level: Deep analysis and critical thinking prompts

5. Include:
   - What is depicted in the image
   - Educational concepts related to the image
   - Why this might be important for learning
   - Suggestions for how to use this image in studying
   - Examples that relate to ${studentProfile.goal}

6. Format as plain text only - NO markdown, NO special characters, NO bullet points
7. Write in natural sentences and paragraphs
8. Keep responses clear and educational, not just descriptive

Please provide a comprehensive educational analysis of this image:`;
};
