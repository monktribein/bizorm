import React, { useState, useEffect } from "react";
import { api } from "../../services/api";
import { Settings, Plus, Trash2, ArrowUp, ArrowDown, Check, RefreshCw } from "lucide-react";

export const SettingsPage = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newQuestionText, setNewQuestionText] = useState("");

  const loadQuestions = async () => {
    setLoading(true);
    try {
      const res = await api.getAllQuestions();
      if (res.success) setQuestions(res.questions);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestions();
  }, []);

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;

    try {
      await api.createQuestion({ questionText: newQuestionText });
      setNewQuestionText("");
      loadQuestions();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this survey question?")) return;
    try {
      await api.deleteQuestion(id);
      loadQuestions();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleMove = async (index, direction) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= questions.length) return;

    const copy = [...questions];
    const [moved] = copy.splice(index, 1);
    copy.splice(targetIdx, 0, moved);

    setQuestions(copy);

    try {
      await api.reorderQuestions(copy.map((q) => q._id));
    } catch (err) {
      alert(err.message);
      loadQuestions();
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div>
        <h1 style={{ fontSize: "24px", fontWeight: "800", color: "var(--secondary)" }}>
          Private Survey Settings
        </h1>
        <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>
          Customize the questions shown to dissatisfied customers (1–3 stars) during the star-gated feedback workflow
        </p>
      </div>

      <div className="grid-2">
        {/* Questions List */}
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: "700" }}>
              Survey Question Order ({questions.length})
            </h3>
            <button onClick={loadQuestions} className="btn btn-outline btn-sm">
              <RefreshCw size={14} /> Refresh
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {questions.map((q, idx) => (
              <div
                key={q._id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 14px",
                  borderRadius: "var(--radius-md)",
                  background: "#f8fafc",
                  border: "1px solid var(--border)",
                  fontSize: "14px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontWeight: "700", color: "var(--text-subtle)", width: "20px" }}>
                    {idx + 1}.
                  </span>
                  <span style={{ fontWeight: "500" }}>{q.questionText}</span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <button
                    onClick={() => handleMove(idx, -1)}
                    disabled={idx === 0}
                    className="btn btn-outline btn-sm"
                    style={{ padding: "4px 8px" }}
                  >
                    <ArrowUp size={12} />
                  </button>
                  <button
                    onClick={() => handleMove(idx, 1)}
                    disabled={idx === questions.length - 1}
                    className="btn btn-outline btn-sm"
                    style={{ padding: "4px 8px" }}
                  >
                    <ArrowDown size={12} />
                  </button>
                  <button
                    onClick={() => handleDelete(q._id)}
                    className="btn btn-danger btn-sm"
                    style={{ padding: "4px 8px" }}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Question Card */}
        <div className="card" style={{ height: "fit-content" }}>
          <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "12px" }}>
            Add New Survey Question
          </h3>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "16px" }}>
            Customers rate each question from 1 to 5 stars on the private feedback page.
          </p>

          <form onSubmit={handleAddQuestion}>
            <div className="form-group">
              <label className="form-label">Question Text</label>
              <textarea
                className="form-textarea"
                rows={3}
                placeholder="e.g. How satisfied were you with the speed of service?"
                value={newQuestionText}
                onChange={(e) => setNewQuestionText(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>
              <Plus size={16} /> Add Question
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
