import { MouseEventHandler } from "react";
type ButtonPrimaryProps = {
  title: string;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

export default function ButtonPrimary({
  title,
  disabled = false,
  onClick,
}: ButtonPrimaryProps) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      type="submit"
      className="text-sm px-4 py-2 outline-none bg-primary-500 hover:bg-primary-400 focus:ring-1 focus:ring-surface-900 transition-colors disabled:bg-primary-400 disabled:opacity-80"
    >
      {title}
    </button>
  );
}
