import express from "express";
import { validateProfile, validateProfileUpdate, handleValidationErrors } from "../middleware/validation.js";
import {
  createProfile,
  getAllProfiles,
  getProfileById,
  getProfileByUserId,
  updateProfile,
  deleteProfile
} from "../controllers/profileController.js";

const router = express.Router();

// Create a new profile
router.post("/", validateProfile, handleValidationErrors, createProfile);

// Get all profiles
router.get("/", getAllProfiles);

// Get profile by userId (must come before /:id to avoid conflicts)
router.get("/user/:userId", getProfileByUserId);

// Get profile by ID
router.get("/:id", getProfileById);

// Update profile
router.put("/:id", validateProfileUpdate, handleValidationErrors, updateProfile);

// Delete profile
router.delete("/:id", deleteProfile);

export default router;
