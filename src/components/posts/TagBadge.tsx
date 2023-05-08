const TagBadge = ({ label, color }: { label: string, color: string }) => {
  return <span className="badge" style={{ backgroundColor: color }}>{label}</span>;
};

export default TagBadge;
