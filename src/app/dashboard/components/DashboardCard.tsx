import { Paper, Flex } from "@mantine/core";

type DashboardCardProps = {
  children: React.ReactNode;
  showHoverEffect?: boolean;
  className?: string;
};

export default function DashboardCard({
  children,
  className,
}: DashboardCardProps) {
  return (
    <Paper shadow="sm" p="lg" radius="sm" withBorder className={className}>
      <Flex direction="column">{children}</Flex>
    </Paper>
  );
}
