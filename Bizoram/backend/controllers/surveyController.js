import { SurveyQuestion } from "../models/SurveyQuestion.js";
import { SurveyAnswer } from "../models/SurveyAnswer.js";
import { Rating } from "../models/Rating.js";
import { seedSurveyQuestions as seedFn } from "../utils/seed.js";

// Public: Get active survey questions for client feedback form
export const getActiveQuestions = async (req, res, next) => {
  try {
    const questions = await SurveyQuestion.find({ active: 1 }).sort({ orderBy: 1 });
    res.json({ success: true, questions });
  } catch (error) {
    next(error);
  }
};

// Super Admin: Get all survey questions
export const getAllQuestions = async (req, res, next) => {
  try {
    const questions = await SurveyQuestion.find().sort({ orderBy: 1 });
    res.json({ success: true, questions });
  } catch (error) {
    next(error);
  }
};

// Super Admin: Create new survey question
export const createQuestion = async (req, res, next) => {
  try {
    const { questionText } = req.body;
    if (!questionText) {
      return res.status(400).json({ success: false, message: "Question text is required" });
    }

    const last = await SurveyQuestion.findOne().sort({ orderBy: -1 });
    const orderBy = last ? last.orderBy + 1 : 1;

    const question = await SurveyQuestion.create({
      questionText: questionText.trim(),
      orderBy,
      active: 1,
    });

    res.status(201).json({ success: true, question });
  } catch (error) {
    next(error);
  }
};

// Super Admin: Update survey question
export const updateQuestion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { questionText, orderBy, active } = req.body;

    const question = await SurveyQuestion.findById(id);
    if (!question) {
      return res.status(404).json({ success: false, message: "Question not found" });
    }

    if (questionText !== undefined) question.questionText = questionText.trim();
    if (orderBy !== undefined) question.orderBy = orderBy;
    if (active !== undefined) question.active = active;

    await question.save();

    res.json({ success: true, question });
  } catch (error) {
    next(error);
  }
};

// Super Admin: Reorder questions
export const reorderQuestions = async (req, res, next) => {
  try {
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ success: false, message: "orderedIds must be an array" });
    }

    for (let i = 0; i < orderedIds.length; i++) {
      await SurveyQuestion.findByIdAndUpdate(orderedIds[i], { orderBy: i + 1 });
    }

    res.json({ success: true, message: "Questions reordered successfully" });
  } catch (error) {
    next(error);
  }
};

// Super Admin: Delete question and cascade delete answers
export const deleteQuestion = async (req, res, next) => {
  try {
    const { id } = req.params;
    await SurveyQuestion.findByIdAndDelete(id);
    await SurveyAnswer.deleteMany({ questionId: id });
    res.json({ success: true, message: "Question and associated answers deleted" });
  } catch (error) {
    next(error);
  }
};

// Public: Submit survey answers
export const submitSurvey = async (req, res, next) => {
  try {
    const { ratingId, answers } = req.body;

    if (!ratingId || !Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: "ratingId and answers array are required",
      });
    }

    const rating = await Rating.findById(ratingId);
    if (!rating) {
      return res.status(404).json({ success: false, message: "Rating record not found" });
    }

    const docs = answers.map((ans) => ({
      ratingId,
      questionId: ans.questionId,
      score: Number(ans.score),
      branchId: rating.branchId || null,
    }));

    await SurveyAnswer.insertMany(docs);

    rating.surveyCompleted = true;
    await rating.save();

    res.status(201).json({
      success: true,
      message: "Survey answers recorded successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Protected: Get survey analytics
export const getSurveyAnalytics = async (req, res, next) => {
  try {
    const role = req.user.getNormalizedRole();
    const { branchId } = req.query;

    const query = {};
    if (role === "SUPER_ADMIN") {
      if (branchId) query.branchId = branchId;
    } else {
      if (req.user.branchId) query.branchId = req.user.branchId;
    }

    const questions = await SurveyQuestion.find().sort({ orderBy: 1 });
    const answers = await SurveyAnswer.find(query);

    const analytics = questions.map((q) => {
      const qAnswers = answers.filter((a) => a.questionId.toString() === q._id.toString());
      const count = qAnswers.length;
      const totalScore = qAnswers.reduce((sum, a) => sum + a.score, 0);
      const averageScore = count > 0 ? Number((totalScore / count).toFixed(1)) : 0;

      return {
        questionId: q._id,
        questionText: q.questionText,
        totalAnswers: count,
        averageScore,
      };
    });

    res.json({ success: true, analytics });
  } catch (error) {
    next(error);
  }
};

export const seedQuestions = async (req, res, next) => {
  try {
    const { forceReset } = req.body;
    if (forceReset) {
      await SurveyQuestion.deleteMany({});
      await SurveyAnswer.deleteMany({});
    }
    await seedFn();
    res.json({ success: true, message: "Default questions seeded" });
  } catch (error) {
    next(error);
  }
};
