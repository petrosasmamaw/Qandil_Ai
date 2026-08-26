import { generateContentWithFallback } from './geminiClient';

export const generateAssignmentGuidance = async (file, studentProfile, appLanguage = 'eng') => {
  try {
    // Create guidance prompt based on student profile
    const systemPrompt = createGuidancePrompt(studentProfile, appLanguage);

    // Read file as base64
    const fileData = await readFileAsBase64(file);
    const mimeType = getMimeType(file.type);

    // Upload file and process using Gemini with fallback
    const { text } = await generateContentWithFallback({
      systemInstruction: systemPrompt,
      contents: [
        {
          inlineData: {
            data: fileData,
            mimeType: mimeType,
          },
        },
        "Please provide assignment guidance for this document based on my profile.",
      ],
    });

    return {
      success: true,
      guidance: text,
      fileName: file.name,
      processedAt: new Date(),
    };
  } catch (error) {
    console.error('Error generating guidance:', error);
    throw new Error('Failed to generate guidance: ' + error.message);
  }
};

export const generateAssignmentGuidanceFromText = async (text, title, studentProfile, appLanguage = 'eng') => {
  try {
    // Create guidance prompt based on student profile
    const systemPrompt = createGuidancePrompt(studentProfile, appLanguage);

    // Process text content using Gemini with fallback
    const { text: responseText } = await generateContentWithFallback({
      systemInstruction: systemPrompt,
      contents: [
        {
          text: text,
        },
        "Please provide assignment guidance for this text based on my profile.",
      ],
    });

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

const createGuidancePrompt = (studentProfile, appLanguage = 'eng') => {
  const preferredLang = appLanguage === 'amh' ? 'Amharic (Ethiopian)' : studentProfile.preferredLanguage || 'English';

  return `You are a dedicated academic mentor specializing in the ${studentProfile.studySystem} curriculum. Your goal is to coach ${studentProfile.name}, a Grade ${studentProfile.grade} student, on the process of completing their assignment without ever providing the direct answers.

STUDENT CONTEXT:
Level: ${studentProfile.level}
Goal: ${studentProfile.goal}
System: ${studentProfile.studySystem}
Primary Language: ${preferredLang}

TASK:
Analyze the provided document and create a strategic roadmap. You must adapt your coaching style to the "${studentProfile.level}" level. 
- Foundation: Focus on the "First Step" and build confidence.
- Guided: Provide the framework and let them fill the gaps.
- Independent: Provide the "North Star" and let them navigate.
- Analytical: Challenge the logic and push for original synthesis.

THE BAHIR DAR FLOW STRATEGY:
When explaining how to organize their work, use a local analogy from Bahir Dar. Compare the assignment process to navigating the city. For example, the 'Research Phase' could be like gathering supplies at the Saturday Market (Gozamy), the 'Drafting Phase' like the steady flow of the Abay River, and the 'Final Review' like looking out from the viewpoint of Bezawit Hill to see the whole picture. Use these landmarks to make the abstract steps of an assignment feel tangible.

STRICT OUTPUT RULES:
- WRITE IN PLAIN TEXT ONLY.
- ABSOLUTELY NO MARKDOWN (no stars, hashes, bolding, or italics).
- NO BULLET POINTS OR NUMBERED LISTS.
- NO SPECIAL CHARACTERS OR SYMBOLS.
- Use natural, flowing paragraphs and complete sentences.
- Language Requirement: You MUST write the assignment guidance primarily in ${preferredLang}. This is a strict requirement.

REQUIRED CONTENT SECTIONS:
1. A summary of the assignment mission.
2. A breakdown of the primary requirements.
3. A strategic approach using the Bahir Dar navigation analogy.
4. Step by step procedural advice written in narrative form.
5. Critical concepts they must master to succeed.
6. Reflective questions that force the student to find their own answers.
7. Specific advice for achieving their goal of ${studentProfile.goal}.

Maintain a supportive and professional tone. Begin the guidance now:`;
};