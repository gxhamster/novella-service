import { StudentsTableColumnDef } from "../lib/types";
import { createColumnHelper } from "@tanstack/react-table";
import { IIssuedBook, IStudent } from "@/supabase/types/supabase";
import { Dispatch, SetStateAction, useState } from "react";
import { UseFormSetValue } from "react-hook-form";
import { trpc } from "@/app/_trpc/client";
import { getStudentsByPageType } from "@/server/routes/student";
import { Drawer } from "@mantine/core";
import FixedTableSmall from "@/components/FixedTable/FixedTableSmall";
import FixedTableSmallToolbar from "@/components/FixedTable/FixedTableSmallToolbar";
import FixedTableSmallContent from "@/components/FixedTable/FixedTableSmallContent";
import { FixedTableFetchFunctionProps } from "@/components/FixedTable";

const studentsColHelper = createColumnHelper<getStudentsByPageType>();
const studentsTableCols: Array<StudentsTableColumnDef> = [
  { id: "id", header: "ID" },
  { id: "name", header: "Name" },
  { id: "island", header: "Island" },
  { id: "address", header: "Address" },
  { id: "phone", header: "Phone" },
  { id: "grade", header: "Grade" },
  { id: "index", header: "Index" },
];

const studentsTableColsTanstack = studentsTableCols.map((column) =>
  studentsColHelper.accessor(column.id, {
    cell: (info) => info.getValue(),
    header: column.header,
  })
);

type SelectStudentDrawerProps = {
  isAddStudentDrawerOpen: boolean;
  setIsAddStudentDrawerOpen: Dispatch<SetStateAction<boolean>>;
  setSelectedStudent: Dispatch<SetStateAction<getStudentsByPageType | null>>;
  formSetValue: UseFormSetValue<IIssuedBook>;
};

export default function SelectStudentDrawer({
  isAddStudentDrawerOpen,
  setIsAddStudentDrawerOpen,
  setSelectedStudent,
  formSetValue,
}: SelectStudentDrawerProps) {
  const [fetchFunctionOpts, setFetchFunctionOpts] = useState<
    FixedTableFetchFunctionProps<IStudent>
  >({
    pageIndex: 0,
    pageSize: 10,
    filters: [],
    sorts: null,
  });

  const getStudentsByPageQuery = trpc.students.getStudentsByPage.useQuery(
    fetchFunctionOpts,
    { keepPreviousData: true }
  );

  return (
    <Drawer
      title="Select a student to issue to"
      styles={{
        content: {
          display: "flex",
          flexDirection: "column",
        },
        body: {
          padding: 0,
          display: "flex",
          flexDirection: "column",
          flexGrow: "1",
          overflow: "hidden",
        },
      }}
      position="right"
      size="xl"
      opened={isAddStudentDrawerOpen}
      onClose={() => {
        setIsAddStudentDrawerOpen(false);
      }}
    >
      <FixedTableSmall<getStudentsByPageType>
        data={getStudentsByPageQuery.data?.data || []}
        dataCount={getStudentsByPageQuery.data?.count || 0}
        tanStackColumns={studentsTableColsTanstack}
        onPaginationChanged={(opts) => setFetchFunctionOpts(opts)}
        onRowSelectionChanged={(state) => {
          if (state) {
            setIsAddStudentDrawerOpen(false);
            setSelectedStudent(state);
            formSetValue("student_id", state.id);
          }
        }}
      >
        <FixedTableSmallToolbar<getStudentsByPageType>
          onRefresh={getStudentsByPageQuery.refetch}
          columns={studentsTableCols}
          loading={
            getStudentsByPageQuery.isLoading ||
            getStudentsByPageQuery.isRefetching
          }
        />
        <FixedTableSmallContent />
      </FixedTableSmall>
    </Drawer>
  );
}
