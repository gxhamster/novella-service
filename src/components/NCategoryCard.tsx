import { Group, Paper, Title, Stack } from "@mantine/core";
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
    <Paper shadow="sm" p="xl" radius="sm" withBorder>
      <Group gap={40} justify="space-between" w="100%" grow align="flex-start">
        <Stack>
          <Title order={2} fw={400} c="dark.1">
            {title}
          </Title>
          <Title order={4} fw={300} c="dark.2">
            {subtitle}
          </Title>
        </Stack>
        <Stack>{children}</Stack>
      </Group>
    </Paper>
  );
}
