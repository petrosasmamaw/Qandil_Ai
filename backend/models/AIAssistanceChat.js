import mongoose from "mongoose";

const aiAssistanceChatSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    messages: [
      {
        role: {
          type: String,
          enum: ["user", "assistant"],
          required: true,
        },
        content: {
          type: String,
          required: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        fileNames: [String], // Store file names for pdfs, docs, images
      },
    ],
    title: {
      type: String,
      default: "New Chat",
    },
    learningLevel: String, // Store learning level if selected
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("AIAssistanceChat", aiAssistanceChatSchema);
