import { MouseEventHandler } from "react";

type ButtonGhostProps = {
  disabled?: boolean;
  fontSize?: "xs" | "sm" | "normal" | "lg" | "xl";
  title?: string;
  icon?: React.ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

export default function ButtonGhost({
  title,
  disabled,
  fontSize = "sm",
  onClick = (e) => {
    e.target;
  },
  icon,
}: ButtonGhostProps) {
  return (
    <button
      className={`py-2 px-3 inline-flex text-${fontSize} gap-2 justify-center items-center text-surface-700 bg-surface-200 hover:bg-surface-300 transition-all border-[1px] border-surface-200 focus:border-surface-900 disabled:bg-surface-200 disabled:opacity-60`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon}
      <span>{title}</span>
    </button>
  );
}
