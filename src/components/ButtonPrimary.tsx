import { MouseEventHandler } from "react";
type ButtonPrimaryProps = {
  title: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

export default function ButtonPrimary({
  title,
  disabled = false,
  icon,
  onClick,
}: ButtonPrimaryProps) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      type="submit"
      className="text-sm px-4  py-2 flex items-center gap-3 outline-none bg-primary-500 hover:bg-primary-400 border-[1px] border-primary-500 focus:border-primary-900 transition-colors disabled:bg-primary-400 disabled:opacity-80"
    >
      {icon}
      <span>{title}</span>
    </button>
  );
}
