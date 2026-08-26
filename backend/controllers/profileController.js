import Profile from "../models/Profile.js";

// Create a new profile
export const createProfile = async (req, res) => {
  try {
    const savedProfile = await Profile.create(req.body);
    res.status(201).json({
      success: true,
      message: "Profile created successfully",
      data: savedProfile
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating profile",
      error: error.message
    });
  }
};

// Get all profiles
export const getAllProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find();
    res.status(200).json({
      success: true,
      count: profiles.length,
      data: profiles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching profiles",
      error: error.message
    });
  }
};

// Get profile by ID
export const getProfileById = async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found"
      });
    }
    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching profile",
      error: error.message
    });
  }
};

// Get profile by userId
export const getProfileByUserId = async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.params.userId });
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found for this user"
      });
    }
    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching profile",
      error: error.message
    });
  }
};

// Update profile
export const updateProfile = async (req, res) => {
  try {
    const profile = await Profile.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found"
      });
    }
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: profile
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating profile",
      error: error.message
    });
  }
};

// Delete profile
export const deleteProfile = async (req, res) => {
  try {
    const profile = await Profile.findByIdAndDelete(req.params.id);
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found"
      });
    }
    res.status(200).json({
      success: true,
      message: "Profile deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting profile",
      error: error.message
    });
  }
};
