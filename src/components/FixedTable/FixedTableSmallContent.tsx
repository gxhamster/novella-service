import { Table, Text } from "@mantine/core";
import { flexRender } from "@tanstack/react-table";
import { useSmallTable } from "./FixedTableSmall";

export default function FixedTableSmallContent() {
  const { table } = useSmallTable();

  return (
    <div className="flex-grow overflow-scroll bg-dark-8 relative">
      <Table
        layout="auto"
        stickyHeader
        verticalSpacing="xs"
        horizontalSpacing="xs"
        highlightOnHover
        withRowBorders
        withColumnBorders
      >
        <Table.Thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <Table.Tr key={headerGroup.id}>
              {headerGroup.headers.map((header, idx) => (
                <Table.Th key={header.id}>
                  <Text size="sm" c="gray.4" fw="bold" truncate>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </Text>
                </Table.Th>
              ))}
            </Table.Tr>
          ))}
        </Table.Thead>
        <Table.Tbody>
          {table.getRowModel().rows.map((row) => (
            <Table.Tr key={row.id} onClick={() => row.toggleSelected()}>
              {row.getVisibleCells().map((cell, _idx) => (
                <Table.Td maw={350} key={cell.id}>
                  <Text c="dark.1" size="xs" truncate>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Text>
                </Table.Td>
              ))}
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </div>
  );
}
