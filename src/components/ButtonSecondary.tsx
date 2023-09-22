import { MouseEventHandler } from "react";

type ButtonSecondary = {
  disabled?: boolean;
  fontSize?: "xs" | "sm" | "normal" | "lg" | "xl";
  title?: string;
  icon?: React.ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

export default function ButtonSecondary({
  title,
  disabled = false,
  onClick,
  icon,
  fontSize = "sm",
}: ButtonSecondary) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`text-${fontSize} px-4 py-2 outline-none txet-surface-900 bg-surface-400 hover:bg-surface-500 border-[1px] border-surface-400 focus:border-surface-900 transition-colors disabled:text-surface-700 disabled:opacity-80 disabled:bg-surface-300`}
    >
      {icon}
      <span>{title}</span>
    </button>
  );
}
