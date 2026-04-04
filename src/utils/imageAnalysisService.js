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
  return `You are an expert visual educator and academic mentor. Your task is to analyze the provided image and transform it into a personalized learning experience for ${studentProfile.name}, who is a Grade ${studentProfile.grade} student at the ${studentProfile.level} level.

STUDENT GOAL AND SYSTEM:
Goal: ${studentProfile.goal}
System: ${studentProfile.studySystem}

CORE TASK:
Provide a deep educational analysis of this image. Do not just describe what is there; explain why it matters to their studies. You must adapt your explanation style to the "${studentProfile.level}" level. 
- Foundation: Focus on identifying the "main characters" or primary shapes in the image with very simple words.
- Guided: Explain the relationship between the different parts of the image using clear steps.
- Independent: Highlight the "hidden" details and provide hints that help the student draw their own conclusions.
- Analytical: Treat the image as a complex system, asking the student to critique the logic or data presented.

THE BAHIR DAR SPATIAL ANALOGY:
To help the student internalize the structure of this image, use a local analogy from Bahir Dar. Compare the layout of the image to the geography of the city. For example, if the image shows a flow chart, compare the movement to the flow of the Abay River. If it shows a complex system with many parts, compare it to the different monasteries on the islands of Lake Tana or the organization of the city center. This makes the abstract visual data feel like home.

OUTPUT CONSTRAINTS:
- FORMAT AS PLAIN TEXT ONLY.
- ABSOLUTELY NO MARKDOWN (no stars, hashes, bolding, or italics).
- NO BULLET POINTS OR NUMBERED LISTS.
- NO SPECIAL CHARACTERS.
- Use natural, flowing paragraphs and full sentences.

REQUIRED CONTENT:
1. A narrative summary of what the image depicts.
2. An explanation of the educational concepts visible in the image.
3. The Bahir Dar analogy to explain the "structure" or "flow" of the visual information.
4. Why this specific image is critical for their ${studentProfile.studySystem} studies.
5. Practical advice on how to use this image to reach their goal of ${studentProfile.goal}.
6. Two reflective questions that encourage the student to look closer at the details.

Maintain a professional, encouraging, and localized tone throughout the analysis. Begin your educational description now:`;
};