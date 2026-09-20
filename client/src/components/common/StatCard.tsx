interface StatCardProps {
  label: string;
  value: string | number;
  tone?: "warm" | "green" | "red" | "blue";
}

function StatCard({ label, value, tone = "warm" }: StatCardProps) {
  return (
    <div className={`stat-card stat-card-${tone}`}>
      <p>{label}</p>
      <strong>{value}</strong>
    </div>
  );
}

export default StatCard;
