import { Accordion, Group, Text, Tooltip } from "@mantine/core";
import {
  Icon123,
  IconCalendarEvent,
  IconCircleCheckFilled,
  IconLetterCase,
  IconSelect,
} from "@tabler/icons-react";

type FilterGroupType = "text" | "numeric" | "date" | "select";

function getFilterGroupIcon(groupType: FilterGroupType) {
  switch (groupType) {
    case "numeric":
      return <Icon123 size={20} color="gray" stroke={1.5} />;
    case "date":
      return <IconCalendarEvent color="gray" size={20} stroke={1.5} />;
    case "text":
      return <IconLetterCase color="gray" size={20} stroke={1.5} />;
    case "select":
      return <IconSelect color="gray" size={20} stroke={1.5} />;
  }
}

type FilterGroupProps = {
  key: number;
  title: string;
  children: React.ReactNode;
  active: boolean;
  type?: FilterGroupType;
};
export default function FilterGroup({
  children,
  type = "text",
  key,
  active = false,
  title,
}: FilterGroupProps) {
  return (
    <Accordion.Item key={key} value={title} my={10}>
      <Accordion.Control variant="light">
        <Group justify="space-between">
          <Group gap={5}>
            {getFilterGroupIcon(type)}
            <Text size="xs" fz="sm" c="dark.1">
              {title}
            </Text>
          </Group>
          {active && (
            <Tooltip
              label="A filter has been applied to this field"
              color="dark.5"
            >
              <IconCircleCheckFilled size={20} stroke={1.5} />
            </Tooltip>
          )}
        </Group>
      </Accordion.Control>
      <Accordion.Panel>{children}</Accordion.Panel>
    </Accordion.Item>
  );
}
