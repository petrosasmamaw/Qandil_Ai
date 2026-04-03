import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      trim: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    grade: {
      type: Number,
      required: true,
      min: 9,
      max: 12
    },

    level: {
      type: String,
      enum: [
        "foundation",
        "guided",
        "independent",
        "analytical"
      ],
      required: true
    },

    studySystem: {
      type: String,
      enum: [
        "theoretical",
        "conceptual",
        "exam_oriented",
        "problem_solving",
        "mixed"
      ],
      required: true
    },

    preferredLanguage: {
      type: String,
      default: "en"
    },

    goal: {
      type: String,
      enum: [
        "pass_exam",
        "high_grades",
        "deep_understanding",
        "quick_revision"
      ],
      required: true
    }

  },
  {
    timestamps: true
  }
);

export default mongoose.model("Profile", profileSchema);
