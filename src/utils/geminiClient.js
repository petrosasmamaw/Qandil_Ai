import { GoogleGenerativeAI } from '@google/generative-ai';

// Fast, low-latency Gemini model priority hierarchy
export const GEMINI_MODELS = [
  'gemini-3.1-flash-lite-preview', // Ultra fast, low-latency (1-3s)
  'gemini-3.6-flash',              // High-quality fast multimodal
  'gemini-3.7-flash',              // Deep reasoning flash
  'gemini-3.1-pro-preview',        // Pro grade fallback
  'gemini-flash-latest',           // Generic latest flash
];

const getApiKey = () => {
  const key = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error(
      "Gemini API Key is missing. Please set NEXT_PUBLIC_GEMINI_API_KEY in your .env file."
    );
  }
  return key;
};

export const getGenAIClient = () => {
  return new GoogleGenerativeAI(getApiKey());
};

/**
 * Retries a function with backoff for transient issues
 */
const retryWithBackoff = async (fn, maxRetries = 2, baseDelay = 500) => {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      const msg = error?.message?.toLowerCase() || '';
      const isTransient =
        msg.includes('503') ||
        msg.includes('high demand') ||
        msg.includes('overloaded') ||
        msg.includes('resource_exhausted') ||
        msg.includes('429') ||
        msg.includes('rate limit');

      if (attempt === maxRetries - 1 || !isTransient) {
        throw error;
      }

      const delay = baseDelay * Math.pow(2, attempt);
      console.warn(`[Gemini Retry] Attempt ${attempt + 1} hit transient error. Retrying in ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

/**
 * Executes a Gemini request with automatic fallback through the model list
 */
export const executeWithModelFallback = async (taskFn, customModels = GEMINI_MODELS) => {
  const genAI = getGenAIClient();
  let lastError = null;

  for (let i = 0; i < customModels.length; i++) {
    const modelName = customModels[i];
    try {
      const result = await retryWithBackoff(() => taskFn(genAI, modelName));
      return { result, usedModel: modelName };
    } catch (error) {
      lastError = error;
      console.warn(`[Gemini Fallback] Model '${modelName}' issue: ${error.message}. Trying fallback...`);
    }
  }

  throw new Error(`All Gemini models failed. Last error: ${lastError?.message || 'Unknown error'}`);
};

/**
 * Generate content using the best available model with fallback
 */
export const generateContentWithFallback = async ({
  contents,
  systemInstruction,
  generationConfig,
  customModels,
}) => {
  const { result, usedModel } = await executeWithModelFallback(async (genAI, modelName) => {
    const modelOptions = { model: modelName };
    if (systemInstruction) {
      modelOptions.systemInstruction = systemInstruction;
    }
    if (generationConfig) {
      modelOptions.generationConfig = generationConfig;
    }

    const model = genAI.getGenerativeModel(modelOptions);

    let requestParam;
    if (typeof contents === 'string') {
      requestParam = generationConfig
        ? { contents: [{ role: 'user', parts: [{ text: contents }] }], generationConfig }
        : contents;
    } else if (Array.isArray(contents)) {
      const parts = contents.map((item) => {
        if (typeof item === 'string') return { text: item };
        return item;
      });
      requestParam = generationConfig
        ? { contents: [{ role: 'user', parts }], generationConfig }
        : parts;
    } else {
      requestParam = contents;
    }

    const response = await model.generateContent(requestParam);
    return response;
  }, customModels);

  return {
    response: result.response,
    text: result.response.text(),
    usedModel,
  };
};

/**
 * Start a chat session and send a message with automatic model fallback
 */
export const sendChatMessageWithFallback = async ({
  systemInstruction,
  history = [],
  userMessage,
  generationConfig = { maxOutputTokens: 1024, temperature: 0.7 },
  customModels,
}) => {
  const { result, usedModel } = await executeWithModelFallback(async (genAI, modelName) => {
    const modelOptions = { model: modelName };
    if (systemInstruction) {
      modelOptions.systemInstruction = systemInstruction;
    }

    const model = genAI.getGenerativeModel(modelOptions);
    const chat = model.startChat({
      history,
      generationConfig,
    });

    const response = await chat.sendMessage(userMessage);
    return response;
  }, customModels);

  return {
    response: result,
    text: result.response.text(),
    usedModel,
  };
};
