import { Stack, Button, Text } from "@mantine/core";
import Link from "next/link";
import BoxIcon from "../icons/BoxIcon";
import RightArrowIcon from "../icons/RightArrowIcon";
import { useTable } from "./FixedTable";

export default function FixedTableEmptyContent() {
  const { data } = useTable();

  return (
    data.length === 0 && (
      <div className="flex justify-center items-center h-full bg-dark-8">
        <Stack gap={10}>
          <BoxIcon size={120} className="text-dark-2" strokeWidth={1} />
          <Stack gap={5}>
            <Text size="xl" c="dark.1">
              Empty table
            </Text>
            <Text size="md" c="dark.2">
              To create a new entry, click Create
            </Text>
            <Button
              mt={20}
              variant="outline"
              leftSection={<RightArrowIcon size={18} />}
            >
              <Link href="/dashboard">Go to dashboard</Link>
            </Button>
          </Stack>
        </Stack>
      </div>
    )
  );
}
