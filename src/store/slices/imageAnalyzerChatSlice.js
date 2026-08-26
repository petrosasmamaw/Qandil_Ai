import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getApiBaseUrl } from "@/utils/apiUrl";

const BACKEND_URL = getApiBaseUrl();

// Async Thunks
export const createImageAnalyzerChat = createAsyncThunk(
  "imageAnalyzerChat/createChat",
  async ({ userId, title }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BACKEND_URL}/image-analyzer-chat/create`, {
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

export const addMessageToImageAnalyzerChat = createAsyncThunk(
  "imageAnalyzerChat/addMessage",
  async ({ chatId, role, content, fileNames }, { rejectWithValue }) => {
    try {
      console.log('addMessageToImageAnalyzerChat thunk called with:', { chatId, role, content, fileNames });
      const url = `${BACKEND_URL}/image-analyzer-chat/message`;
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
      console.error('addMessageToImageAnalyzerChat error:', error);
      return rejectWithValue(error.message);
    }
  }
);

export const fetchImageAnalyzerChatHistory = createAsyncThunk(
  "imageAnalyzerChat/fetchHistory",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/image-analyzer-chat/history/${userId}`
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchImageAnalyzerChatById = createAsyncThunk(
  "imageAnalyzerChat/fetchChatById",
  async (chatId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BACKEND_URL}/image-analyzer-chat/${chatId}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteImageAnalyzerChatThunk = createAsyncThunk(
  "imageAnalyzerChat/deleteChat",
  async (chatId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BACKEND_URL}/image-analyzer-chat/${chatId}`, {
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

export const updateImageAnalyzerChatTitle = createAsyncThunk(
  "imageAnalyzerChat/updateTitle",
  async ({ chatId, title }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BACKEND_URL}/image-analyzer-chat/${chatId}`, {
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
const imageAnalyzerChatSlice = createSlice({
  name: "imageAnalyzerChat",
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
      .addCase(createImageAnalyzerChat.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createImageAnalyzerChat.fulfilled, (state, action) => {
        state.loading = false;
        state.currentChat = action.payload;
        state.success = true;
      })
      .addCase(createImageAnalyzerChat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Add Message
    builder
      .addCase(addMessageToImageAnalyzerChat.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addMessageToImageAnalyzerChat.fulfilled, (state, action) => {
        state.loading = false;
        state.currentChat = action.payload;
        state.success = true;
      })
      .addCase(addMessageToImageAnalyzerChat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch History
    builder
      .addCase(fetchImageAnalyzerChatHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchImageAnalyzerChatHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.chatHistory = action.payload;
      })
      .addCase(fetchImageAnalyzerChatHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch Chat by ID
    builder
      .addCase(fetchImageAnalyzerChatById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchImageAnalyzerChatById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentChat = action.payload;
      })
      .addCase(fetchImageAnalyzerChatById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete Chat
    builder
      .addCase(deleteImageAnalyzerChatThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteImageAnalyzerChatThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.chatHistory = state.chatHistory.filter(
          (chat) => chat._id !== action.payload
        );
        state.success = true;
      })
      .addCase(deleteImageAnalyzerChatThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update Title
    builder
      .addCase(updateImageAnalyzerChatTitle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateImageAnalyzerChatTitle.fulfilled, (state, action) => {
        state.loading = false;
        state.currentChat = action.payload;
        state.success = true;
      })
      .addCase(updateImageAnalyzerChatTitle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSuccess } = imageAnalyzerChatSlice.actions;
export default imageAnalyzerChatSlice.reducer;
