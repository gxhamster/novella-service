import { flexRender } from "@tanstack/react-table";
import { Table, Stack, Text } from "@mantine/core";
import { useDataTable } from "./DataTable";

function DataTableEmptyContent() {
  return (
    <Table.Tr>
      <Table.Td colSpan={12} className="">
        <Stack justify="center" align="center">
          <Text c="dark.1" size="sm">
            There are currently no records in the table
          </Text>
        </Stack>
      </Table.Td>
    </Table.Tr>
  );
}

export default function DataTableContent() {
  const { table, data } = useDataTable();

  return (
    <Table
      verticalSpacing="sm"
      horizontalSpacing="sm"
      highlightOnHover
      withTableBorder
    >
      <Table.Thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <Table.Tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <Table.Th
                key={header.id}
                className="text-start p-2 px-4 font-semibold text-sm bg-dark-6/[0.5]"
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </Table.Th>
            ))}
          </Table.Tr>
        ))}
      </Table.Thead>
      <Table.Tbody>
        {data && data.length !== 0 ? (
          table.getRowModel().rows.map((row) => (
            <Table.Tr key={row.id} onClick={() => row.toggleSelected()}>
              {row.getVisibleCells().map((cell) => (
                <Table.Td key={cell.id} className="p-2 px-4 text-ellipsis">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Table.Td>
              ))}
            </Table.Tr>
          ))
        ) : (
          <DataTableEmptyContent />
        )}
      </Table.Tbody>
    </Table>
  );
}
