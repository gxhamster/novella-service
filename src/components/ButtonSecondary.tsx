import { MouseEventHandler } from "react";

type ButtonSecondary = {
  title: string;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

export default function ButtonSecondary({
  title,
  disabled = false,
  onClick,
}: ButtonSecondary) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="px-4 py-2 outline-none txet-surface-900 bg-surface-300 hover:bg-surface-400 focus:ring-1 focus:ring-surface-900 w-[80px] transition-colors disabled:text-surface-700 disabled:opacity-80 disabled:bg-surface-300"
    >
      {title}
    </button>
  );
}
