import { Paper, Flex } from "@mantine/core";

type DashboardCardProps = {
  children: React.ReactNode;
  showHoverEffect?: boolean;
  className?: string;
};

export default function DashboardCard({
  children,
  showHoverEffect = true,
  className,
}: DashboardCardProps) {
  return (
    <Paper shadow="sm" p="lg" radius="sm" withBorder className={className}>
      <Flex direction="column">{children}</Flex>
    </Paper>
    // <div
    //   className={`bg-dark-9 shadow-lg shadow-surface-100 py-4 px-6 flex flex-col gap-1 ${
    //     showHoverEffect
    //       ? "hover:bg-primary-500 group hover:text-surface-900 transition-colors"
    //       : ""
    //   } ${className}`}
    // >
    //   {children}
    // </div>
  );
}
