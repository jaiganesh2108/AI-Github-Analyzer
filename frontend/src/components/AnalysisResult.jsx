import { useState } from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar } from "recharts";

const COLORS = ["#00E5FF", "#FF6B6B", "#FFD93D", "#6BCB77", "#C77DFF", "#FF9A3C", "#4ECDC4", "#A8DADC"];

const FILE_TYPE_LABELS = {
  file: "Files",
  dir: "Directories",
  symlink: "Symlinks",
};

function getExtension(name) {
  const parts = name.split(".");
  return parts.length > 1 ? `.${parts[parts.length - 1]}` : "other";
}

function buildExtensionData(structure) {
  const counts = {};
  structure.forEach((f) => {
    if (f.type === "file") {
      const ext = getExtension(f.name);
      counts[ext] = (counts[ext] || 0) + 1;
    }
  });
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, value]) => ({ name, value }));
}

function buildTypeData(structure) {
  const counts = {};
  structure.forEach((f) => {
    counts[f.type] = (counts[f.type] || 0) + 1;
  });
  return Object.entries(counts).map(([name, value]) => ({
    name: FILE_TYPE_LABELS[name] || name,
    value,
  }));
}

function StatCard({ label, value, icon, accent }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.03)",
      border: `1px solid ${accent}33`,
      borderRadius: 16,
      padding: "20px 24px",
      display: "flex",
      alignItems: "center",
      gap: 16,
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, ${accent}, transparent)`,
      }} />
      <span style={{ fontSize: 28 }}>{icon}</span>
      <div>
        <div style={{ fontSize: 26, fontWeight: 700, color: accent, fontFamily: "'Space Mono', monospace" }}>{value}</div>
        <div style={{ fontSize: 12, color: "#8899AA", letterSpacing: "0.08em", textTransform: "uppercase" }}>{label}</div>
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: "#0D1B2A",
        border: "1px solid #00E5FF33",
        borderRadius: 10,
        padding: "8px 14px",
        fontSize: 13,
        color: "#E0F4FF",
      }}>
        <strong>{payload[0].name}</strong>: {payload[0].value}
      </div>
    );
  }
  return null;
};

export default function AnalysisResult({ result }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [expandedLines, setExpandedLines] = useState(false);

  if (!result) return null;

  const structure = result.structure || [];
  const analysis = result.analysis || "";
  const extData = buildExtensionData(structure);
  const typeData = buildTypeData(structure);
  const totalFiles = structure.filter((f) => f.type === "file").length;
  const totalDirs = structure.filter((f) => f.type === "dir").length;
  const totalItems = structure.length;
  const analysisLines = analysis.split("\n").filter(Boolean);
  const visibleLines = expandedLines ? analysisLines : analysisLines.slice(0, 6);

  const tabs = ["overview", "structure", "analysis"];

  return (
    <div style={{
      fontFamily: "'DM Sans', sans-serif",
      color: "#E0F4FF",
      padding: "0",
    }}>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-ring {
          0% { box-shadow: 0 0 0 0 rgba(0, 229, 255, 0.3); }
          70% { box-shadow: 0 0 0 10px rgba(0, 229, 255, 0); }
          100% { box-shadow: 0 0 0 0 rgba(0, 229, 255, 0); }
        }
        .tab-btn { transition: all 0.2s ease; cursor: pointer; }
        .tab-btn:hover { color: #00E5FF !important; }
        .file-row:hover { background: rgba(0,229,255,0.05) !important; }
        .expand-btn:hover { color: #00E5FF !important; }
      `}</style>

      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ animation: "fadeUp 0.5s ease", marginBottom: 36 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <div style={{
              width: 10, height: 10, borderRadius: "50%",
              background: "#00E5FF", animation: "pulse-ring 2s infinite",
            }} />
            <span style={{ fontSize: 12, letterSpacing: "0.15em", color: "#00E5FF", textTransform: "uppercase", fontFamily: "'Space Mono', monospace" }}>
              Analysis Complete
            </span>
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 700, margin: 0, background: "linear-gradient(135deg, #E0F4FF 30%, #00E5FF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Repository Insights
          </h1>
        </div>

        {/* Stat Cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 16,
          marginBottom: 36,
          animation: "fadeUp 0.6s ease",
        }}>
          <StatCard label="Total Items" value={totalItems} icon="📦" accent="#00E5FF" />
          <StatCard label="Files" value={totalFiles} icon="📄" accent="#6BCB77" />
          <StatCard label="Directories" value={totalDirs} icon="📁" accent="#FFD93D" />
          <StatCard label="File Types" value={extData.length} icon="🧩" accent="#C77DFF" />
        </div>

        {/* Tabs */}
        <div style={{
          display: "flex", gap: 4, marginBottom: 28,
          background: "rgba(255,255,255,0.03)",
          borderRadius: 12, padding: 4, width: "fit-content",
          border: "1px solid rgba(255,255,255,0.06)",
        }}>
          {tabs.map((t) => (
            <button
              key={t}
              className="tab-btn"
              onClick={() => setActiveTab(t)}
              style={{
                background: activeTab === t ? "rgba(0,229,255,0.12)" : "transparent",
                border: activeTab === t ? "1px solid rgba(0,229,255,0.3)" : "1px solid transparent",
                borderRadius: 9,
                color: activeTab === t ? "#00E5FF" : "#667788",
                padding: "8px 20px",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
                textTransform: "capitalize",
                letterSpacing: "0.04em",
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* TAB: Overview */}
        {activeTab === "overview" && (
          <div style={{ animation: "fadeUp 0.4s ease" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              {/* File Type Distribution Pie */}
              <div style={{
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 20, padding: "28px 24px",
              }}>
                <h3 style={{ margin: "0 0 6px", fontSize: 15, fontWeight: 600, color: "#C8D8E8" }}>File Extensions</h3>
                <p style={{ margin: "0 0 20px", fontSize: 12, color: "#5A7080" }}>Distribution by file type across the repository</p>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={extData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={90}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {extData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 14px", marginTop: 8 }}>
                  {extData.map((d, i) => (
                    <span key={i} style={{ fontSize: 11, color: "#99AABB", display: "flex", alignItems: "center", gap: 5 }}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS[i % COLORS.length], display: "inline-block" }} />
                      {d.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Entry Type Bar */}
              <div style={{
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 20, padding: "28px 24px",
              }}>
                <h3 style={{ margin: "0 0 6px", fontSize: 15, fontWeight: 600, color: "#C8D8E8" }}>Entry Types</h3>
                <p style={{ margin: "0 0 20px", fontSize: 12, color: "#5A7080" }}>Breakdown of files, directories, and symlinks</p>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={typeData} barSize={36}>
                    <XAxis dataKey="name" tick={{ fill: "#667788", fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#667788", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                      {typeData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Top Extensions Bar */}
              <div style={{
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 20, padding: "28px 24px",
                gridColumn: "1 / -1",
              }}>
                <h3 style={{ margin: "0 0 6px", fontSize: 15, fontWeight: 600, color: "#C8D8E8" }}>Top File Extensions by Count</h3>
                <p style={{ margin: "0 0 20px", fontSize: 12, color: "#5A7080" }}>How many files of each extension exist in the repo</p>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={extData} layout="vertical" barSize={16}>
                    <XAxis type="number" tick={{ fill: "#667788", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis dataKey="name" type="category" width={64} tick={{ fill: "#99AABB", fontSize: 12, fontFamily: "'Space Mono', monospace" }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                      {extData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* TAB: Structure */}
        {activeTab === "structure" && (
          <div style={{ animation: "fadeUp 0.4s ease" }}>
            <div style={{
              background: "rgba(255,255,255,0.025)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 20, padding: "28px 24px",
            }}>
              <h3 style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 600, color: "#C8D8E8" }}>Repository Structure</h3>
              <p style={{ margin: "0 0 20px", fontSize: 12, color: "#5A7080" }}>{totalItems} entries found</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {structure.map((f, i) => (
                  <div
                    key={i}
                    className="file-row"
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "10px 14px", borderRadius: 10,
                      transition: "background 0.15s ease",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ fontSize: 16 }}>{f.type === "dir" ? "📁" : f.type === "symlink" ? "🔗" : "📄"}</span>
                      <span style={{
                        fontFamily: "'Space Mono', monospace",
                        fontSize: 13, color: f.type === "dir" ? "#FFD93D" : f.type === "symlink" ? "#C77DFF" : "#B8D0E0",
                      }}>
                        {f.name}
                      </span>
                    </div>
                    <span style={{
                      fontSize: 10, fontWeight: 600, letterSpacing: "0.1em",
                      textTransform: "uppercase", padding: "3px 10px", borderRadius: 20,
                      background: f.type === "dir" ? "rgba(255,217,61,0.1)" : f.type === "symlink" ? "rgba(199,125,255,0.1)" : "rgba(0,229,255,0.08)",
                      color: f.type === "dir" ? "#FFD93D" : f.type === "symlink" ? "#C77DFF" : "#00E5FF",
                      border: `1px solid ${f.type === "dir" ? "#FFD93D33" : f.type === "symlink" ? "#C77DFF33" : "#00E5FF22"}`,
                    }}>
                      {f.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB: Analysis */}
        {activeTab === "analysis" && (
          <div style={{ animation: "fadeUp 0.4s ease" }}>
            <div style={{
              background: "rgba(255,255,255,0.025)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 20, padding: "28px 28px",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <span style={{ fontSize: 20 }}>🤖</span>
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "#C8D8E8" }}>AI Analysis Summary</h3>
              </div>
              <p style={{ margin: "0 0 24px", fontSize: 12, color: "#5A7080" }}>Auto-generated insights about the repository</p>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {visibleLines.map((line, i) => (
                  <div key={i} style={{
                    display: "flex", gap: 14, alignItems: "flex-start",
                    padding: "14px 16px",
                    background: "rgba(0,229,255,0.03)",
                    border: "1px solid rgba(0,229,255,0.08)",
                    borderRadius: 12,
                  }}>
                    <span style={{
                      minWidth: 22, height: 22, borderRadius: "50%",
                      background: "rgba(0,229,255,0.1)", border: "1px solid rgba(0,229,255,0.2)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 10, color: "#00E5FF", fontWeight: 700, fontFamily: "'Space Mono', monospace",
                    }}>
                      {i + 1}
                    </span>
                    <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: "#B0C8DA" }}>{line}</p>
                  </div>
                ))}
              </div>

              {analysisLines.length > 6 && (
                <button
                  className="expand-btn"
                  onClick={() => setExpandedLines(!expandedLines)}
                  style={{
                    marginTop: 16, background: "none", border: "none",
                    color: "#667788", cursor: "pointer", fontSize: 13,
                    fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
                    transition: "color 0.2s",
                    display: "flex", alignItems: "center", gap: 6,
                  }}
                >
                  {expandedLines ? "▲ Show less" : `▼ Show ${analysisLines.length - 6} more lines`}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}