import mongoose from "mongoose";

const surveyQuestionSchema = new mongoose.Schema(
  {
    questionText: {
      type: String,
      required: true,
      trim: true,
    },
    orderBy: {
      type: Number,
      default: 1,
    },
    active: {
      type: Number,
      default: 1, // 1 = Active, 0 = Inactive
    },
  },
  {
    timestamps: true,
  }
);

export const SurveyQuestion = mongoose.model("SurveyQuestion", surveyQuestionSchema);
