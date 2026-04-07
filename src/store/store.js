import { configureStore } from "@reduxjs/toolkit";
import profileReducer from "./slices/profileSlice";
import aiAssistanceChatReducer from "./slices/aiAssistanceChatSlice";
import notesChatReducer from "./slices/notesChatSlice";
import assignmentGuideChatReducer from "./slices/assignmentGuideChatSlice";
import imageAnalyzerChatReducer from "./slices/imageAnalyzerChatSlice";
import themeReducer from "./slices/themeSlice";
import languageReducer from "./slices/languageSlice";

export const store = configureStore({
  reducer: {
    profile: profileReducer,
    aiAssistanceChat: aiAssistanceChatReducer,
    notesChat: notesChatReducer,
    assignmentGuideChat: assignmentGuideChatReducer,
    imageAnalyzerChat: imageAnalyzerChatReducer,
    theme: themeReducer,
    language: languageReducer,
  },
});
