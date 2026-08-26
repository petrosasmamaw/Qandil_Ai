import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getApiBaseUrl } from "@/utils/apiUrl";

const BACKEND_URL = getApiBaseUrl();

// Async thunks
export const createProfile = createAsyncThunk(
  "profile/createProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BACKEND_URL}/profiles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create profile");
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchProfileByUserId = createAsyncThunk(
  "profile/fetchProfileByUserId",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BACKEND_URL}/profiles/user/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch profile");
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async ({ profileId, profileData }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BACKEND_URL}/profiles/${profileId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update profile");
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteProfile = createAsyncThunk(
  "profile/deleteProfile",
  async (profileId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BACKEND_URL}/profiles/${profileId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete profile");
      }

      return profileId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial state
const initialState = {
  profile: null,
  profiles: [],
  loading: false,
  error: null,
  success: false,
  successMessage: "",
};

// Slice
const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
      state.successMessage = "";
    },
    resetProfile: (state) => {
      state.profile = null;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    // Create Profile
    builder
      .addCase(createProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.success = true;
        state.successMessage = "Profile created successfully!";
      })
      .addCase(createProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create profile";
        state.success = false;
      });

    // Fetch Profile by User ID
    builder
      .addCase(fetchProfileByUserId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfileByUserId.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(fetchProfileByUserId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch profile";
        state.profile = null;
      });

    // Update Profile
    builder
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.success = true;
        state.successMessage = "Profile updated successfully!";
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update profile";
        state.success = false;
      });

    // Delete Profile
    builder
      .addCase(deleteProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProfile.fulfilled, (state) => {
        state.loading = false;
        state.profile = null;
        state.success = true;
        state.successMessage = "Profile deleted successfully!";
      })
      .addCase(deleteProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete profile";
      });
  },
});

export const { clearError, clearSuccess, resetProfile } = profileSlice.actions;
export default profileSlice.reducer;
