import { ChangeEventHandler } from "react";

export default function Select({
  children,
  value,
  onChange,
  className,
}: {
  value?: string | number;
  onChange?: ChangeEventHandler<HTMLSelectElement>;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <select
      onChange={onChange}
      value={value}
      className={`${className} apperance-none bg-surface-200 outline-none p-1 text-xs border-[1px] border-surface-200 focus:border-surface-900 hover:bg-surface-300`}
    >
      {children}
    </select>
  );
}
