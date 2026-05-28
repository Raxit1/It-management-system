export default function StatCard({ title, value, icon, trend, trendType = "neutral" }) {
  const getTrendColor = () => {
    if (trendType === "positive") return "#137333";
    if (trendType === "negative") return "#c5221f";
    return "#64748b";
  };

  return (
    <div className="dashboard-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
          <h3 style={{ margin: 0, fontSize: "14px", color: "#64748b", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            {title}
          </h3>
          {icon && <span style={{ fontSize: "20px" }}>{icon}</span>}
        </div>
        <p style={{ margin: 0, fontSize: "32px", fontWeight: "700", color: "#111827" }}>
          {value}
        </p>
      </div>
      {trend && (
        <span style={{ fontSize: "13px", marginTop: "12px", fontWeight: "500", color: getTrendColor() }}>
          {trend}
        </span>
      )}
    </div>
  );
}