type NCategoryCardProps = {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
};

export default function NCategoryCard({
  title,
  subtitle,
  children,
}: NCategoryCardProps) {
  return (
    <div
      className="bg-surface-200 flex flex-col border-[0.7px] border-surface-400 scroll-m-6"
      id={title}
    >
      <div className="flex gap-[15rem] justify-start px-14 py-10">
        <div className="flex flex-col flex-grow-0 max-w-[300px] min-w-[300px]">
          <h3 className="text-2xl font-light">{title}</h3>
          <span className="text-md text-surface-700 mt-3">{subtitle}</span>
        </div>
        <div className="flex flex-col gap-5 flex-grow flex-shrink-0">
          {children}
        </div>
      </div>
    </div>
  );
}
