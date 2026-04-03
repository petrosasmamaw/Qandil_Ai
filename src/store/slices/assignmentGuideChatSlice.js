import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/api";

// Async Thunks
export const createAssignmentGuideChat = createAsyncThunk(
  "assignmentGuideChat/createChat",
  async ({ userId, title }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/assignment-guide-chat/create`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, title }),
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addMessageToAssignmentGuideChat = createAsyncThunk(
  "assignmentGuideChat/addMessage",
  async ({ chatId, role, content, fileNames }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BACKEND_URL}/assignment-guide-chat/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatId, role, content, fileNames }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAssignmentGuideChatHistory = createAsyncThunk(
  "assignmentGuideChat/fetchHistory",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/assignment-guide-chat/history/${userId}`
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAssignmentGuideChatById = createAsyncThunk(
  "assignmentGuideChat/fetchChatById",
  async (chatId, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/assignment-guide-chat/${chatId}`
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteAssignmentGuideChatThunk = createAsyncThunk(
  "assignmentGuideChat/deleteChat",
  async (chatId, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/assignment-guide-chat/${chatId}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      return chatId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice
const assignmentGuideChatSlice = createSlice({
  name: "assignmentGuideChat",
  initialState: {
    chats: [],
    currentChat: null,
    chatHistory: [],
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    // Create Chat
    builder
      .addCase(createAssignmentGuideChat.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAssignmentGuideChat.fulfilled, (state, action) => {
        state.loading = false;
        state.currentChat = action.payload;
        state.success = true;
      })
      .addCase(createAssignmentGuideChat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Add Message
    builder
      .addCase(addMessageToAssignmentGuideChat.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addMessageToAssignmentGuideChat.fulfilled, (state, action) => {
        state.loading = false;
        state.currentChat = action.payload;
        state.success = true;
      })
      .addCase(addMessageToAssignmentGuideChat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch History
    builder
      .addCase(fetchAssignmentGuideChatHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssignmentGuideChatHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.chatHistory = action.payload;
      })
      .addCase(fetchAssignmentGuideChatHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch Chat by ID
    builder
      .addCase(fetchAssignmentGuideChatById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssignmentGuideChatById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentChat = action.payload;
      })
      .addCase(fetchAssignmentGuideChatById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete Chat
    builder
      .addCase(deleteAssignmentGuideChatThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAssignmentGuideChatThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.chatHistory = state.chatHistory.filter(
          (chat) => chat._id !== action.payload
        );
        state.success = true;
      })
      .addCase(deleteAssignmentGuideChatThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSuccess } = assignmentGuideChatSlice.actions;
export default assignmentGuideChatSlice.reducer;
