import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/api";

// Async Thunks
export const createNotesChat = createAsyncThunk(
  "notesChat/createChat",
  async ({ userId, title }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BACKEND_URL}/notes-chat/create`, {
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

export const addMessageToNotesChat = createAsyncThunk(
  "notesChat/addMessage",
  async ({ chatId, role, content, fileNames }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BACKEND_URL}/notes-chat/message`, {
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

export const fetchNotesChatHistory = createAsyncThunk(
  "notesChat/fetchHistory",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/notes-chat/history/${userId}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchNotesChatById = createAsyncThunk(
  "notesChat/fetchChatById",
  async (chatId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BACKEND_URL}/notes-chat/${chatId}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteNotesChatThunk = createAsyncThunk(
  "notesChat/deleteChat",
  async (chatId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BACKEND_URL}/notes-chat/${chatId}`, {
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

// Slice
const notesChatSlice = createSlice({
  name: "notesChat",
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
      .addCase(createNotesChat.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNotesChat.fulfilled, (state, action) => {
        state.loading = false;
        state.currentChat = action.payload;
        state.success = true;
      })
      .addCase(createNotesChat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Add Message
    builder
      .addCase(addMessageToNotesChat.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addMessageToNotesChat.fulfilled, (state, action) => {
        state.loading = false;
        state.currentChat = action.payload;
        state.success = true;
      })
      .addCase(addMessageToNotesChat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch History
    builder
      .addCase(fetchNotesChatHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotesChatHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.chatHistory = action.payload;
      })
      .addCase(fetchNotesChatHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch Chat by ID
    builder
      .addCase(fetchNotesChatById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotesChatById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentChat = action.payload;
      })
      .addCase(fetchNotesChatById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete Chat
    builder
      .addCase(deleteNotesChatThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteNotesChatThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.chatHistory = state.chatHistory.filter(
          (chat) => chat._id !== action.payload
        );
        state.success = true;
      })
      .addCase(deleteNotesChatThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSuccess } = notesChatSlice.actions;
export default notesChatSlice.reducer;
