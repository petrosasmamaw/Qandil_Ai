import { configureStore } from "@reduxjs/toolkit";
import profileReducer from "./slices/profileSlice";
import aiAssistanceChatReducer from "./slices/aiAssistanceChatSlice";
import notesChatReducer from "./slices/notesChatSlice";
import assignmentGuideChatReducer from "./slices/assignmentGuideChatSlice";
import imageAnalyzerChatReducer from "./slices/imageAnalyzerChatSlice";

export const store = configureStore({
  reducer: {
    profile: profileReducer,
    aiAssistanceChat: aiAssistanceChatReducer,
    notesChat: notesChatReducer,
    assignmentGuideChat: assignmentGuideChatReducer,
    imageAnalyzerChat: imageAnalyzerChatReducer,
  },
});
