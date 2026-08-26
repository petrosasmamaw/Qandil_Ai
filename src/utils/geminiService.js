'use client';

import { generateContentWithFallback } from './geminiClient';

export const generateLearningLevelQuiz = async (profileData) => {
  try {
    const prompt = `You are an educational assessment expert. Based on the student's profile information, generate exactly 10 multiple-choice quiz questions to assess their learning level.

Student Profile:
- Name: ${profileData.name}
- Grade: ${profileData.grade}
- Study System: ${profileData.studySystem}
- Learning Goal: ${profileData.goal}
- Preferred Language: ${profileData.preferredLanguage}

Generate 10 multiple-choice questions based strictly on the Ethiopian National Curriculum (High School level). The questions must cover a mix of subjects including Mathematics, Physics, Biology, Chemistry, and Civics.
Organize the 10 questions to identify the student's proficiency across these four levels:
Foundation (3 Questions): Recalling basic facts (e.g., definitions of Ethiopian historical sites or basic cell parts).
Guided (3 Questions): Applying formulas or rules with clear steps (e.g., solving a standard linear equation or identifying a grammatical rule).
Independent (2 Questions): Solving multi-step problems without hints (e.g., calculating velocity in a Physics word problem or interpreting a biology experiment).
Analytical (2 Questions): Evaluating scenarios or creating solutions (e.g., analyzing the impact of the GERD on regional cooperation or synthesizing chemical reactions).

Requirements:

Provide 4 options (A, B, C, D) for each.

Format your response as a JSON array. Each question should have this structure:
{
  "id": 1,
  "question": "Question text",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctAnswer": "The exact text of the correct option",
  "hint": "Optional hint for the question"
}

Only respond with the JSON array, no additional text.`;

    const { text } = await generateContentWithFallback({
      contents: prompt,
    });
    
    // Clean up the response in case it has markdown code blocks
    let cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
    
    const questions = JSON.parse(cleanedText);
    return questions;
  } catch (error) {
    console.error('Error generating quiz:', error);
    throw new Error('Failed to generate quiz questions: ' + error.message);
  }
};

export const determineLearningLevel = async (profileData, quizAnswers, questions) => {
  try {
    const answersText = questions
      .map((q, index) => `Q${index + 1}: ${q.question}\nCorrect Answer: ${q.correctAnswer}\nStudent's Answer: ${quizAnswers[index]}`)
      .join('\n\n');

    const prompt = `You are an educational psychologist specializing in learning level assessment. 

Based on the student's profile and their quiz answers, determine their appropriate learning level.

Student Profile:
- Name: ${profileData.name}
- Grade: ${profileData.grade}
- Study System: ${profileData.studySystem}
- Learning Goal: ${profileData.goal}

Student's Quiz Answers:
${answersText}

Based on the answers and profile, calculate a score out of 10 based on how many questions they answered correctly, and determine the most appropriate learning level strictly using these criteria:
- Foundation: Score < 5/10
- Guided: Score 5-6/10
- Independent: Score 7-8/10
- Analytical: Score 9-10/10

Respond with ONLY the learning level name (foundation, guided, independent, or analytical), the calculated score (out of 10), and a brief explanation in this JSON format:
{
  "level": "foundation|guided|independent|analytical",
  "score": 7,
  "explanation": "Brief explanation of why this level was chosen"
}

Only respond with JSON, no additional text.`;

    const { text } = await generateContentWithFallback({
      contents: prompt,
    });
    
    // Clean up the response in case it has markdown code blocks
    let cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
    
    const levelData = JSON.parse(cleanedText);
    return levelData;
  } catch (error) {
    console.error('Error determining learning level:', error);
    throw new Error('Failed to determine learning level: ' + error.message);
  }
};
