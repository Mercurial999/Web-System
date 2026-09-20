interface StatusBadgeProps {
  value: string;
}

function StatusBadge({ value }: StatusBadgeProps) {
  const tone = value.toLowerCase().replaceAll("_", "-");

  return <span className={`status-badge status-${tone}`}>{value.replaceAll("_", " ")}</span>;
}

export default StatusBadge;
