type NBadgeProps = {
  children: React.ReactNode;
  type: "success" | "secondary" | "alert";
};

export default function NBadge({ children, type }: NBadgeProps) {
  const colorSchemes = {
    success: "bg-success-400",
    secondary: "bg-surface-500",
    alert: "bg-alert-400",
  };

  return (
    <span
      className={`px-2 py-0.5 font-semibold text-xs rounded-sm ${colorSchemes[type]}`}
    >
      {children}
    </span>
  );
}
