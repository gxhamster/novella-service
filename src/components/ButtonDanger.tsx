import { MouseEventHandler } from "react";
type ButtonDangerProps = {
  title: string;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

export default function ButtonDanger({
  title,
  disabled = false,
  onClick,
}: ButtonDangerProps) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      type="submit"
      className="text-sm px-4 py-2 outline-none bg-alert-500 hover:bg-alert-400 focus:ring-1 focus:ring-surface-900 transition-colors disabled:bg-alert-400 disabled:opacity-80"
    >
      {title}
    </button>
  );
}
