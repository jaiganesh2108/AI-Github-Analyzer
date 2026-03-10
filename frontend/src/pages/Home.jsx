import { useState } from 'react';
import RepoInput from '../components/RepoInput';
import AnalysisResult from '../components/AnalysisResult';

export default function Home() {
  const [result, setResult] = useState(null);

  return (
    <div style={{
      fontFamily: "'DM Sans', sans-serif",
      background: "#070E17",
      minHeight: "100vh",
      color: "#E0F4FF",
      position: "relative",
      overflowX: "hidden",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />

      <style>{`
        @keyframes gridMove {
          from { transform: translateY(0); }
          to { transform: translateY(60px); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; } 50% { opacity: 0.3; }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-12px); }
          to { opacity: 1; transform: translateX(0); }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>

      {/* Animated grid */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0,
        backgroundImage: "linear-gradient(rgba(0,229,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.035) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
        animation: "gridMove 10s linear infinite",
        pointerEvents: "none",
      }} />

      {/* Glow orbs */}
      <div style={{
        position: "fixed", width: 700, height: 700, borderRadius: "50%",
        top: "-200px", left: "-200px", zIndex: 0,
        background: "radial-gradient(circle, rgba(0,229,255,0.05) 0%, transparent 65%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "fixed", width: 600, height: 600, borderRadius: "50%",
        bottom: "-150px", right: "-150px", zIndex: 0,
        background: "radial-gradient(circle, rgba(199,125,255,0.06) 0%, transparent 65%)",
        pointerEvents: "none",
      }} />

      {/* Navbar */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 40px", height: 64,
        background: "rgba(7,14,23,0.8)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 9,
            background: "linear-gradient(135deg, #00E5FF, #0077AA)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16,
          }}>⚡</div>
          <span style={{
            fontFamily: "'Space Mono', monospace",
            fontWeight: 700, fontSize: 14, color: "#E0F4FF",
            letterSpacing: "0.02em",
          }}>GitLens<span style={{ color: "#00E5FF" }}>AI</span></span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "5px 12px", borderRadius: 100,
            background: "rgba(0,229,255,0.07)",
            border: "1px solid rgba(0,229,255,0.15)",
            fontSize: 11, color: "#00E5FF",
            fontFamily: "'Space Mono', monospace",
            letterSpacing: "0.08em",
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#00E5FF", display: "inline-block", animation: "blink 2s infinite" }} />
            LIVE
          </div>
        </div>
      </nav>

      {/* Main layout */}
      <div style={{
        position: "relative", zIndex: 1,
        paddingTop: 64,
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}>

        {/* Hero / Input section */}
        <section style={{
          padding: result ? "48px 40px 40px" : "100px 40px 80px",
          maxWidth: 720,
          margin: "0 auto",
          width: "100%",
          transition: "padding 0.5s ease",
          animation: "fadeUp 0.6s ease",
        }}>
          {!result && (
            <>
              {/* Badge */}
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 7,
                  background: "rgba(0,229,255,0.08)",
                  border: "1px solid rgba(0,229,255,0.2)",
                  borderRadius: 100, padding: "5px 14px",
                  fontSize: 11, color: "#00E5FF",
                  fontFamily: "'Space Mono', monospace",
                  letterSpacing: "0.1em",
                }}>
                  <span style={{ fontSize: 13 }}>✦</span> AI-POWERED REPO ANALYSIS
                </span>
              </div>

              {/* Headline */}
              <h1 style={{
                textAlign: "center", fontSize: "clamp(32px, 5vw, 52px)",
                fontWeight: 700, lineHeight: 1.15, marginBottom: 18,
                background: "linear-gradient(150deg, #E0F4FF 30%, #00E5FF 100%)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>
                Understand Any GitHub<br />Repo Instantly
              </h1>

              <p style={{
                textAlign: "center", color: "#4A6070",
                fontSize: 16, lineHeight: 1.7, marginBottom: 44,
              }}>
                Paste a repository URL and get structure breakdowns,<br />
                file-type charts, and an AI-generated summary — in seconds.
              </p>
            </>
          )}

          {/* Compact heading when result shown */}
          {result && (
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              marginBottom: 28, animation: "slideIn 0.4s ease",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: "#6BCB77", boxShadow: "0 0 8px #6BCB77",
                }} />
                <span style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 12, color: "#6BCB77", letterSpacing: "0.1em",
                }}>ANALYSIS READY</span>
              </div>
              <button
                onClick={() => setResult(null)}
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 8, color: "#5A7080",
                  padding: "6px 14px", fontSize: 12,
                  cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                  transition: "all 0.2s",
                }}
                onMouseEnter={e => { e.target.style.color = "#E0F4FF"; e.target.style.borderColor = "rgba(255,255,255,0.18)"; }}
                onMouseLeave={e => { e.target.style.color = "#5A7080"; e.target.style.borderColor = "rgba(255,255,255,0.08)"; }}
              >
                ← New Search
              </button>
            </div>
          )}

          {/* Input component */}
          <RepoInput setResult={setResult} compact={!!result} />

          {/* Feature pills — only on landing */}
          {!result && (
            <div style={{
              display: "flex", flexWrap: "wrap", justifyContent: "center",
              gap: 10, marginTop: 36,
            }}>
              {[
                { icon: "📊", label: "File Distribution Charts" },
                { icon: "🗂️", label: "Repo Structure Explorer" },
                { icon: "🤖", label: "AI Summary" },
                { icon: "⚡", label: "Instant Results" },
              ].map(({ icon, label }) => (
                <div key={label} style={{
                  display: "flex", alignItems: "center", gap: 7,
                  background: "rgba(255,255,255,0.025)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 100, padding: "7px 14px",
                  fontSize: 12, color: "#4A6070",
                }}>
                  <span>{icon}</span> {label}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Divider when result shown */}
        {result && (
          <div style={{
            height: 1,
            background: "linear-gradient(90deg, transparent, rgba(0,229,255,0.15), transparent)",
            margin: "0 40px",
          }} />
        )}

        {/* Results section */}
        {result && (
          <section style={{
            flex: 1,
            padding: "40px",
            maxWidth: 1100,
            margin: "0 auto",
            width: "100%",
            animation: "fadeUp 0.5s ease",
          }}>
            <AnalysisResult result={result} />
          </section>
        )}

        {/* Footer */}
        <footer style={{
          position: "relative", zIndex: 1,
          padding: "24px 40px",
          borderTop: "1px solid rgba(255,255,255,0.04)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginTop: "auto",
        }}>
          <span style={{ fontSize: 11, color: "#1E3040", fontFamily: "'Space Mono', monospace" }}>
            GitLens<span style={{ color: "#0A3040" }}>AI</span> · Public repos only
          </span>
          <span style={{ fontSize: 11, color: "#1E3040" }}>
            Powered by AI analysis
          </span>
        </footer>
      </div>
    </div>
  );
}