import { Table } from "@mantine/core";
import { flexRender } from "@tanstack/react-table";
import { useTable } from "./FixedTable";

export default function FixedTableContent() {
  const { table, data } = useTable();

  return (
    data.length > 0 && (
      <div className=" h-[calc(100vh-43px-57px)] flex-grow overflow-scroll bg-dark-8 m-0 relative">
        <Table
          stickyHeader
          verticalSpacing="xs"
          horizontalSpacing="sm"
          withColumnBorders
          className="w-full table-auto"
        >
          <Table.Thead className="text-surface-900 bg-surface-200 sticky top-0 m-0">
            {table.getHeaderGroups().map((headerGroup) => (
              <Table.Tr key={headerGroup.id}>
                {headerGroup.headers.map((header, idx) => (
                  <Table.Th
                    key={header.id}
                    className={`text-start p-2 px-4 font-semibold text-sm border-x-[0.7px] border-surface-400 whitespace-nowrap`}
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
            {table.getRowModel().rows.map((row) => (
              <Table.Tr
                key={row.id}
                className="text-surface-700 border-b-[0.7px] border-surface-400"
              >
                {row.getVisibleCells().map((cell, idx) => (
                  <Table.Td
                    key={cell.id}
                    className={`p-2 px-4 truncate border-[0.7px] border-surface-400/70 text-sm font-normal`}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Table.Td>
                ))}
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </div>
    )
  );
}
