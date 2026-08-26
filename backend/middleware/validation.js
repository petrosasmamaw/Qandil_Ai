import { body, validationResult } from "express-validator";

export const validateProfile = [
  body("userId")
    .trim()
    .notEmpty()
    .withMessage("User ID is required"),
  
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters"),
  
  body("grade")
    .isInt({ min: 9, max: 12 })
    .withMessage("Grade must be between 9 and 12"),
  
  body("level")
    .isIn(["foundation", "guided", "independent", "analytical"])
    .withMessage("Invalid level"),
  
  body("studySystem")
    .isIn(["theoretical", "conceptual", "exam_oriented", "problem_solving", "mixed"])
    .withMessage("Invalid study system"),
  
  body("goal")
    .isIn(["pass_exam", "high_grades", "deep_understanding", "quick_revision"])
    .withMessage("Invalid goal"),
  
  body("preferredLanguage")
    .optional()
    .isLength({ min: 2, max: 10 })
    .withMessage("Invalid language code"),
];

export const validateProfileUpdate = [
  body("userId")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("User ID cannot be empty"),
  
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters"),
  
  body("grade")
    .optional()
    .isInt({ min: 9, max: 12 })
    .withMessage("Grade must be between 9 and 12"),
  
  body("level")
    .optional()
    .isIn(["foundation", "guided", "independent", "analytical"])
    .withMessage("Invalid level"),
  
  body("studySystem")
    .optional()
    .isIn(["theoretical", "conceptual", "exam_oriented", "problem_solving", "mixed"])
    .withMessage("Invalid study system"),
  
  body("goal")
    .optional()
    .isIn(["pass_exam", "high_grades", "deep_understanding", "quick_revision"])
    .withMessage("Invalid goal"),
  
  body("preferredLanguage")
    .optional()
    .isLength({ min: 2, max: 10 })
    .withMessage("Invalid language code"),
];

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
