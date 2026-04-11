import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/api";

// Async Thunks
export const createAIAssistanceChat = createAsyncThunk(
  "aiAssistanceChat/createChat",
  async ({ userId, title }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BACKEND_URL}/ai-assistance-chat/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, title }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addMessageToAIChat = createAsyncThunk(
  "aiAssistanceChat/addMessage",
  async ({ chatId, role, content, fileNames }, { rejectWithValue }) => {
    try {
      console.log('addMessageToAIChat thunk called with:', { chatId, role, content, fileNames });
      const url = `${BACKEND_URL}/ai-assistance-chat/message`;
      console.log('Calling API:', url);
      
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatId, role, content, fileNames }),
      });
      
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      if (!response.ok) throw new Error(data.message);
      return data.data;
    } catch (error) {
      console.error('addMessageToAIChat error:', error);
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAIAssistanceChatHistory = createAsyncThunk(
  "aiAssistanceChat/fetchHistory",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/ai-assistance-chat/history/${userId}`
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAIAssistanceChatById = createAsyncThunk(
  "aiAssistanceChat/fetchChatById",
  async (chatId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BACKEND_URL}/ai-assistance-chat/${chatId}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteAIAssistanceChatThunk = createAsyncThunk(
  "aiAssistanceChat/deleteChat",
  async (chatId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BACKEND_URL}/ai-assistance-chat/${chatId}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      return chatId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateAIAssistanceChatTitle = createAsyncThunk(
  "aiAssistanceChat/updateTitle",
  async ({ chatId, title }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BACKEND_URL}/ai-assistance-chat/${chatId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice
const aiAssistanceChatSlice = createSlice({
  name: "aiAssistanceChat",
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
      .addCase(createAIAssistanceChat.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAIAssistanceChat.fulfilled, (state, action) => {
        state.loading = false;
        state.currentChat = action.payload;
        state.success = true;
      })
      .addCase(createAIAssistanceChat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Add Message
    builder
      .addCase(addMessageToAIChat.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addMessageToAIChat.fulfilled, (state, action) => {
        state.loading = false;
        state.currentChat = action.payload;
        state.success = true;
      })
      .addCase(addMessageToAIChat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch History
    builder
      .addCase(fetchAIAssistanceChatHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAIAssistanceChatHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.chatHistory = action.payload;
      })
      .addCase(fetchAIAssistanceChatHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch Chat by ID
    builder
      .addCase(fetchAIAssistanceChatById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAIAssistanceChatById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentChat = action.payload;
      })
      .addCase(fetchAIAssistanceChatById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete Chat
    builder
      .addCase(deleteAIAssistanceChatThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAIAssistanceChatThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.chatHistory = state.chatHistory.filter(
          (chat) => chat._id !== action.payload
        );
        state.success = true;
      })
      .addCase(deleteAIAssistanceChatThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update Title
    builder
      .addCase(updateAIAssistanceChatTitle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAIAssistanceChatTitle.fulfilled, (state, action) => {
        state.loading = false;
        state.currentChat = action.payload;
        state.success = true;
      })
      .addCase(updateAIAssistanceChatTitle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSuccess } = aiAssistanceChatSlice.actions;
export default aiAssistanceChatSlice.reducer;
