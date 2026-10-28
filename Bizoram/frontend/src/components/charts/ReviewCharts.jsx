import React, { useState } from "react";
import { Star, BarChart3, PieChart as PieIcon, Calendar } from "lucide-react";

export const ReviewCharts = ({ stats, timeframe, onTimeframeChange, loading }) => {
  const [hoveredSlice, setHoveredSlice] = useState(null);
  const [hoveredBar, setHoveredBar] = useState(null);

  const distribution = stats?.distribution || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  const total = stats?.totalReviews || 0;
  const avgRating = stats?.averageRating || 0;
  const timeSeries = stats?.timeSeries || [];

  // Colors as specified:
  // 5 star: dark green, 4 star: light green, 3 star: yellow/amber, 2 star: orange, 1 star: red
  const STAR_COLORS = {
    5: { name: "5 Stars", color: "#15803d", bg: "#dcfce7", border: "#166534" },
    4: { name: "4 Stars", color: "#4ade80", bg: "#f0fdf4", border: "#22c55e" },
    3: { name: "3 Stars", color: "#f59e0b", bg: "#fef3c7", border: "#d97706" },
    2: { name: "2 Stars", color: "#f97316", bg: "#ffedd5", border: "#ea580c" },
    1: { name: "1 Star",  color: "#ef4444", bg: "#fee2e2", border: "#dc2626" },
  };

  // Pie / Donut SVG math using strokeDasharray
  const radius = 55;
  const circumference = 2 * Math.PI * radius; // ~345.575
  let accumulatedLength = 0;

  const starOrder = [5, 4, 3, 2, 1];
  const slices = starOrder.map((s) => {
    const count = distribution[s] || 0;
    const fraction = total > 0 ? count / total : 0;
    const length = fraction * circumference;
    const offset = -accumulatedLength;
    accumulatedLength += length;
    const percentage = total > 0 ? Math.round(fraction * 100) : 0;
    return {
      star: s,
      count,
      percentage,
      length,
      offset,
      ...STAR_COLORS[s],
    };
  });

  // Bar chart math
  const maxBarValue = Math.max(...timeSeries.map((p) => p.total || 0), 4);
  const barChartHeight = 150;

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
      gap: "20px",
      marginBottom: "24px",
    }}>
      {/* 1. Rating Distribution Pie / Donut Chart */}
      <div className="card" style={{
        padding: "20px 22px",
        borderRadius: "16px",
        border: "1px solid var(--border)",
        background: "#ffffff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minWidth: 0,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              background: "#ecfdf5",
              color: "#059669",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <PieIcon size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: "15px", fontWeight: "800", color: "#0f172a", margin: 0 }}>
                Rating Distribution
              </h3>
              <span style={{ fontSize: "11px", color: "#64748b" }}>
                Proportion of star reviews
              </span>
            </div>
          </div>

          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            background: "#f8fafc",
            padding: "4px 8px",
            borderRadius: "8px",
            fontSize: "12px",
            fontWeight: "700",
            color: "#0f172a",
            border: "1px solid #e2e8f0",
          }}>
            <Star size={13} fill="#f59e0b" color="#f59e0b" />
            <span>{avgRating.toFixed(1)} / 5.0</span>
          </div>
        </div>

        {/* Donut and Legend */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "24px", flexWrap: "wrap", padding: "10px 0" }}>
          {/* SVG Donut */}
          <div style={{ position: "relative", width: "140px", height: "140px", flexShrink: 0 }}>
            <svg
              width="140"
              height="140"
              viewBox="0 0 140 140"
              style={{ transform: "rotate(-90deg)", overflow: "visible" }}
            >
              {total === 0 ? (
                <circle
                  cx="70"
                  cy="70"
                  r={radius}
                  fill="transparent"
                  stroke="#e2e8f0"
                  strokeWidth="20"
                />
              ) : (
                slices.map((slice) => {
                  if (slice.count === 0) return null;
                  const isHovered = hoveredSlice === slice.star;
                  return (
                    <circle
                      key={slice.star}
                      cx="70"
                      cy="70"
                      r={radius}
                      fill="transparent"
                      stroke={slice.color}
                      strokeWidth={isHovered ? 24 : 20}
                      strokeDasharray={`${slice.length} ${circumference - slice.length}`}
                      strokeDashoffset={slice.offset}
                      style={{
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={() => setHoveredSlice(slice.star)}
                      onMouseLeave={() => setHoveredSlice(null)}
                    />
                  );
                })
              )}
            </svg>

            {/* Center Summary */}
            <div style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
            }}>
              {hoveredSlice !== null ? (
                <>
                  <span style={{ fontSize: "16px", fontWeight: "800", color: STAR_COLORS[hoveredSlice].color }}>
                    {distribution[hoveredSlice] || 0}
                  </span>
                  <span style={{ fontSize: "10px", color: "#64748b", fontWeight: "600" }}>
                    {hoveredSlice}★ ({total > 0 ? Math.round(((distribution[hoveredSlice] || 0) / total) * 100) : 0}%)
                  </span>
                </>
              ) : (
                <>
                  <span style={{ fontSize: "18px", fontWeight: "800", color: "#0f172a" }}>
                    {total}
                  </span>
                  <span style={{ fontSize: "10px", color: "#64748b", fontWeight: "600" }}>
                    Total Reviews
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Color Breakdown Legend */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1, minWidth: "150px" }}>
            {slices.map((slice) => {
              const isHovered = hoveredSlice === slice.star;
              return (
                <div
                  key={slice.star}
                  onMouseEnter={() => setHoveredSlice(slice.star)}
                  onMouseLeave={() => setHoveredSlice(null)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "4px 8px",
                    borderRadius: "6px",
                    background: isHovered ? "#f1f5f9" : "transparent",
                    cursor: "pointer",
                    transition: "background 0.15s ease",
                    fontSize: "12px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "3px",
                      background: slice.color,
                      flexShrink: 0,
                    }} />
                    <span style={{ fontWeight: "600", color: "#334155" }}>
                      {slice.name}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontWeight: "700", color: "#0f172a" }}>
                      {slice.count}
                    </span>
                    <span style={{ color: "#94a3b8", fontSize: "11px", minWidth: "28px", textAlign: "right" }}>
                      {slice.percentage}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Review Trends Stacked Bar Graph */}
      <div className="card" style={{
        padding: "20px 22px",
        borderRadius: "16px",
        border: "1px solid var(--border)",
        background: "#ffffff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minWidth: 0,
      }}>
        {/* Header with Timeframe Dropdown */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", flexWrap: "wrap", gap: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              background: "#eff6ff",
              color: "#2563eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <BarChart3 size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: "15px", fontWeight: "800", color: "#0f172a", margin: 0 }}>
                Review Trends
              </h3>
              <span style={{ fontSize: "11px", color: "#64748b" }}>
                Volume & rating composition over time
              </span>
            </div>
          </div>

          {/* Timeframe Dropdown */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Calendar size={13} color="#64748b" />
            <select
              value={timeframe}
              onChange={(e) => onTimeframeChange(e.target.value)}
              className="form-input"
              style={{
                padding: "4px 8px",
                fontSize: "12px",
                fontWeight: "600",
                borderRadius: "8px",
                cursor: "pointer",
                background: "#f8fafc",
                borderColor: "#cbd5e1",
                height: "32px",
              }}
            >
              <option value="daily">Daily (Last 7 Days)</option>
              <option value="weekly">Weekly (Last 4 Weeks)</option>
              <option value="1month">1 Month (Last 30 Days)</option>
              <option value="3month">3 Months (Last 90 Days)</option>
              <option value="1year">1 Year (Last 12 Months)</option>
            </select>
          </div>
        </div>

        {/* Bar Chart Area */}
        <div style={{ position: "relative", paddingTop: "10px" }}>
          {timeSeries.length === 0 ? (
            <div style={{ height: `${barChartHeight}px`, display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", fontSize: "13px" }}>
              No review data available for this timeframe
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "flex-end", height: `${barChartHeight}px`, gap: "10px", paddingBottom: "22px", borderBottom: "1px solid #e2e8f0" }}>
              {timeSeries.map((point, idx) => {
                const totalInPoint = point.total || 0;
                const barHeightPercent = (totalInPoint / maxBarValue) * 100;
                const isHovered = hoveredBar === idx;

                // Segments percentages within this bar
                const s5 = totalInPoint > 0 ? (point[5] / totalInPoint) * 100 : 0;
                const s4 = totalInPoint > 0 ? (point[4] / totalInPoint) * 100 : 0;
                const s3 = totalInPoint > 0 ? (point[3] / totalInPoint) * 100 : 0;
                const s2 = totalInPoint > 0 ? (point[2] / totalInPoint) * 100 : 0;
                const s1 = totalInPoint > 0 ? (point[1] / totalInPoint) * 100 : 0;

                return (
                  <div
                    key={idx}
                    style={{
                      flex: 1,
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-end",
                      alignItems: "center",
                      position: "relative",
                      cursor: "pointer",
                    }}
                    onMouseEnter={() => setHoveredBar(idx)}
                    onMouseLeave={() => setHoveredBar(null)}
                  >
                    {/* Tooltip on hover */}
                    {isHovered && (
                      <div style={{
                        position: "absolute",
                        bottom: "105%",
                        background: "#0f172a",
                        color: "#ffffff",
                        padding: "6px 10px",
                        borderRadius: "8px",
                        fontSize: "11px",
                        whiteSpace: "nowrap",
                        zIndex: 50,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                        pointerEvents: "none",
                        lineHeight: 1.4,
                        textAlign: "center",
                      }}>
                        <div style={{ fontWeight: "700", borderBottom: "1px solid #334155", paddingBottom: "3px", marginBottom: "3px" }}>
                          {point.label}
                        </div>
                        <div>Total: <strong>{totalInPoint}</strong></div>
                        <div style={{ display: "flex", gap: "6px", justifyContent: "center", marginTop: "3px", fontSize: "10px" }}>
                          <span style={{ color: STAR_COLORS[5].color }}>5★: {point[5]}</span>
                          <span style={{ color: STAR_COLORS[4].color }}>4★: {point[4]}</span>
                          <span style={{ color: STAR_COLORS[3].color }}>3★: {point[3]}</span>
                          <span style={{ color: STAR_COLORS[2].color }}>2★: {point[2]}</span>
                          <span style={{ color: STAR_COLORS[1].color }}>1★: {point[1]}</span>
                        </div>
                      </div>
                    )}

                    {/* Total count badge above bar */}
                    {totalInPoint > 0 && (
                      <span style={{ fontSize: "10px", fontWeight: "700", color: "#475569", marginBottom: "4px" }}>
                        {totalInPoint}
                      </span>
                    )}

                    {/* Stacked Colored Bar */}
                    <div style={{
                      width: "100%",
                      maxWidth: "36px",
                      height: `${Math.max(barHeightPercent, totalInPoint > 0 ? 8 : 4)}%`,
                      borderRadius: "6px 6px 0 0",
                      overflow: "hidden",
                      display: "flex",
                      flexDirection: "column-reverse",
                      background: totalInPoint === 0 ? "#f1f5f9" : "transparent",
                      transition: "all 0.2s ease",
                      transform: isHovered ? "scaleY(1.05)" : "scaleY(1)",
                      transformOrigin: "bottom",
                    }}>
                      {totalInPoint > 0 && (
                        <>
                          {s5 > 0 && <div style={{ height: `${s5}%`, background: STAR_COLORS[5].color }} title={`5 Stars: ${point[5]}`} />}
                          {s4 > 0 && <div style={{ height: `${s4}%`, background: STAR_COLORS[4].color }} title={`4 Stars: ${point[4]}`} />}
                          {s3 > 0 && <div style={{ height: `${s3}%`, background: STAR_COLORS[3].color }} title={`3 Stars: ${point[3]}`} />}
                          {s2 > 0 && <div style={{ height: `${s2}%`, background: STAR_COLORS[2].color }} title={`2 Stars: ${point[2]}`} />}
                          {s1 > 0 && <div style={{ height: `${s1}%`, background: STAR_COLORS[1].color }} title={`1 Star: ${point[1]}`} />}
                        </>
                      )}
                    </div>

                    {/* X-axis Date Label */}
                    <span style={{
                      position: "absolute",
                      bottom: "-20px",
                      fontSize: "10px",
                      color: isHovered ? "#0f172a" : "#64748b",
                      fontWeight: isHovered ? "700" : "500",
                      whiteSpace: "nowrap",
                    }}>
                      {point.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Star Color Legend for Bar Graph */}
        <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginTop: "14px", flexWrap: "wrap", fontSize: "11px" }}>
          {starOrder.map((s) => (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "2px", background: STAR_COLORS[s].color }} />
              <span style={{ color: "#64748b", fontWeight: "600" }}>{s}★</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
