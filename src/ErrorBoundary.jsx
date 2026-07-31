import { Component } from "react";

// Catches any uncaught render/runtime error anywhere below it and
// shows a readable message + the error detail instead of leaving
// the page blank white with only a console error nobody sees.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error("Unhandled error rendering the app:", error, info?.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{
          minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
          padding: 24, fontFamily: "system-ui, sans-serif", background: "#0b0b0f", color: "#f5f5f5",
        }}>
          <div style={{ maxWidth: 640 }}>
            <div style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: 10 }}>เกิดข้อผิดพลาดในการโหลดแอป</div>
            <div style={{ fontSize: "0.85rem", opacity: 0.8, marginBottom: 14 }}>
              รายละเอียด (เปิด DevTools Console เพื่อดูเพิ่มเติม):
            </div>
            <pre style={{
              background: "#1a1a20", padding: 14, borderRadius: 8, fontSize: "0.78rem",
              whiteSpace: "pre-wrap", wordBreak: "break-word", overflow: "auto", maxHeight: 300,
            }}>
              {String(this.state.error?.message || this.state.error)}
            </pre>
            <button
              onClick={() => window.location.reload()}
              style={{ marginTop: 16, background: "#f97316", color: "#fff", border: "none", borderRadius: 8, padding: "10px 18px", fontWeight: 700, cursor: "pointer" }}
            >
              โหลดหน้าใหม่
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
