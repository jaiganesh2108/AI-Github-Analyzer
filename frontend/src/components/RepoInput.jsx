import { useState } from "react";
import { analyzeRepo } from "../services/api";

const EXAMPLE_REPOS = [
  "https://github.com/facebook/react",
  "https://github.com/vercel/next.js",
  "https://github.com/tailwindlabs/tailwindcss",
];

export default function RepoInput({ setResult, compact = false }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focused, setFocused] = useState(false);

  const handleAnalyze = async () => {
    if (!url.trim()) {
      setError("Please paste a GitHub repository URL.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await analyzeRepo(url.trim());
      setResult(res.data);
    } catch (err) {
      const detail = err?.response?.data?.detail;
      setError(typeof detail === "string" ? detail : "Failed to analyze repository.");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !loading) handleAnalyze();
  };

  return (
    <div style={{ width: "100%", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .example-pill:hover {
          background: rgba(0,229,255,0.12) !important;
          border-color: rgba(0,229,255,0.4) !important;
          color: #00E5FF !important;
          cursor: pointer;
        }
        .analyze-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #00ccee, #0099bb) !important;
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(0,229,255,0.25) !important;
        }
        .analyze-btn:active:not(:disabled) {
          transform: translateY(0px);
        }
      `}</style>

      <div style={{
        width: "100%",
        maxWidth: compact ? 900 : 720,
        margin: "0 auto",
      }}>
        <div style={{
          background: "rgba(255,255,255,0.025)",
          border: `1px solid ${focused ? "rgba(0,229,255,0.4)" : "rgba(255,255,255,0.07)"}`,
          borderRadius: 20,
          padding: "28px",
          transition: "border-color 0.2s ease",
          backdropFilter: "blur(12px)",
        }}>
          <label style={{ fontSize: 12, letterSpacing: "0.08em", color: "#00E5FF", textTransform: "uppercase", fontWeight: 600, display: "block", marginBottom: 10 }}>
            GitHub Repository URL
          </label>

          <div style={{ display: "flex", gap: 10 }}>
            <div style={{
              flex: 1, display: "flex", alignItems: "center",
              background: "rgba(0,0,0,0.3)",
              border: `1px solid ${focused ? "rgba(0,229,255,0.35)" : "rgba(255,255,255,0.08)"}`,
              borderRadius: 12, padding: "0 16px",
              transition: "border-color 0.2s ease",
            }}>
              <span style={{ fontSize: 16, marginRight: 10, opacity: 0.5 }}>🔗</span>
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                onKeyDown={handleKeyDown}
                placeholder="https://github.com/owner/repository"
                style={{
                  flex: 1, background: "none", border: "none", outline: "none",
                  color: "#E0F4FF", fontSize: 14, padding: "14px 0",
                  fontFamily: "'Space Mono', monospace",
                }}
              />
            </div>

            <button
              className="analyze-btn"
              onClick={handleAnalyze}
              disabled={loading}
              style={{
                background: loading ? "rgba(0,229,255,0.1)" : "linear-gradient(135deg, #00E5FF, #00AACC)",
                border: loading ? "1px solid rgba(0,229,255,0.2)" : "none",
                borderRadius: 12,
                color: loading ? "#00E5FF" : "#070E17",
                padding: "0 24px",
                fontSize: 14, fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "'DM Sans', sans-serif",
                minWidth: 120,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                transition: "all 0.2s ease",
                whiteSpace: "nowrap",
              }}
            >
              {loading ? (
                <>
                  <span style={{
                    width: 14, height: 14, border: "2px solid rgba(0,229,255,0.3)",
                    borderTopColor: "#00E5FF", borderRadius: "50%",
                    display: "inline-block", animation: "spin 0.7s linear infinite",
                  }} />
                  Analyzing
                </>
              ) : (
                <>⚡ Analyze</>
              )}
            </button>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              marginTop: 14, padding: "12px 16px",
              background: "rgba(255,107,107,0.08)", border: "1px solid rgba(255,107,107,0.25)",
              borderRadius: 10, fontSize: 13, color: "#FF9999",
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <span>⚠️</span> {error}
            </div>
          )}

          {/* Loading progress bar */}
          {loading && (
            <div style={{ marginTop: 16, height: 2, background: "rgba(0,229,255,0.1)", borderRadius: 2, overflow: "hidden" }}>
              <div style={{
                height: "100%", width: "40%",
                background: "linear-gradient(90deg, transparent, #00E5FF, transparent)",
                animation: "spin 1.2s linear infinite",
              }} />
            </div>
          )}
        </div>

        <div style={{ marginTop: 22 }}>
          <p style={{ fontSize: 11, letterSpacing: "0.1em", color: "#3A5060", textTransform: "uppercase", textAlign: "center", marginBottom: 12 }}>
            Try an example
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8 }}>
            {EXAMPLE_REPOS.map((repo) => {
              const label = repo.replace("https://github.com/", "");
              return (
                <button
                  key={repo}
                  className="example-pill"
                  onClick={() => setUrl(repo)}
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 100, padding: "6px 14px",
                    fontSize: 12, color: "#5A7080",
                    fontFamily: "'Space Mono', monospace",
                    cursor: "pointer", transition: "all 0.2s ease",
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}