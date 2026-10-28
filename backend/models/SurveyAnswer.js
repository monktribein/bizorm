import mongoose from "mongoose";

const surveyAnswerSchema = new mongoose.Schema(
  {
    ratingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rating",
      required: true,
      index: true,
    },
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SurveyQuestion",
      required: true,
      index: true,
    },
    score: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const SurveyAnswer = mongoose.model("SurveyAnswer", surveyAnswerSchema);
