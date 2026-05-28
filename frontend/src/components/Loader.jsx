export default function Loader({ message = "Loading enterprise data..." }) {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: "40px",
      width: "100%",
      textAlign: "center"
    }}>
      <div className="spinner" style={{
        width: "50px",
        height: "50px",
        border: "6px solid #e2e8f0",
        borderTop: "6px solid #2563eb",
        borderRadius: "50%",
        animation: "spin 1s linear infinite"
      }}></div>
      <p style={{ marginTop: "15px", color: "#64748b", fontSize: "15px", fontWeight: "500" }}>
        {message}
      </p>
    </div>
  );
}