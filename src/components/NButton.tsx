interface NButton extends React.ComponentPropsWithoutRef<"button"> {
  kind?: "primary" | "secondary" | "ghost" | "alert";
  title?: string;
  size?: "xs" | "sm" | "normal" | "lg" | "xl";
  icon?: React.ReactNode;
}

const sizes = {
  xs: {
    padding: "px-1 py-1",
    text: "text-xs",
  },
  sm: {
    padding: "px-2 py-2",
    text: "text-sm",
  },
  normal: {
    padding: "px-4 py-2",
    text: "text-normal",
  },
  lg: {
    padding: "px-5 py-3",
    text: "text-lg",
  },
  xl: {
    padding: "px-5 py-5",
    text: "text-xl",
  },
};

const colors = {
  primary:
    "bg-primary-500 hover:bg-primary-400 border-[1px] border-primary-500 focus:border-primary-900 transition-colors disabled:bg-primary-400 disabled:opacity-80",
  secondary:
    "text-surface-900 bg-surface-400 hover:bg-surface-500 border-[1px] border-surface-400 focus:border-surface-900 transition-colors disabled:text-surface-700 disabled:opacity-80 disabled:bg-surface-300",
  ghost:
    "text-surface-700 bg-surface-200 hover:bg-surface-300 transition-all border-[1px] border-surface-200 focus:border-surface-900 disabled:bg-surface-200 disabled:opacity-60",
  alert:
    "text-surface-900 bg-alert-400 hover:bg-alert-300 transition-all border-[1px] border-alert-400 focus:border-surface-900 disabled:bg-alert-400 disabled:opacity-60",
};

export default function NButton({
  title,
  icon,
  size = "sm",
  kind = "primary",
  ...rest
}: NButton) {
  return (
    <button
      {...rest}
      className={`${sizes[size].padding} ${sizes[size].text} flex gap-2 items-center outline-none ${colors[kind]} ${rest.className}`}
    >
      {icon}
      {title ? <span>{title}</span> : null}
    </button>
  );
}
