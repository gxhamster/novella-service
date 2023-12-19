import NDataTableFixedSmall from "@/components/NDataTableFixed/NDataTableFixedSmall";
import { StudentsTableColumnDef } from "../lib/types";
import { createColumnHelper } from "@tanstack/react-table";
import { IIssuedBook, IStudent } from "@/supabase/types/supabase";
import { Dispatch, SetStateAction, useState } from "react";
import { UseFormSetValue } from "react-hook-form";
import { NDataTableFixedFetchFunctionProps } from "@/components/NDataTableFixed";
import { trpc } from "@/app/_trpc/client";
import { getStudentsByPageType } from "@/server/routes/student";
import { Drawer } from "@mantine/core";

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
    NDataTableFixedFetchFunctionProps<IStudent>
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
        body: { padding: 0 },
      }}
      position="right"
      size="xl"
      opened={isAddStudentDrawerOpen}
      onClose={() => {
        setIsAddStudentDrawerOpen(false);
      }}
    >
      <NDataTableFixedSmall<getStudentsByPageType>
        columns={studentsTableCols}
        tanStackColumns={studentsTableColsTanstack}
        isDataLoading={
          getStudentsByPageQuery.isLoading ||
          getStudentsByPageQuery.isRefetching
        }
        data={
          getStudentsByPageQuery.data ? getStudentsByPageQuery.data.data : []
        }
        dataCount={
          getStudentsByPageQuery.data ? getStudentsByPageQuery.data.count : 0
        }
        onPaginationChanged={(opts) => setFetchFunctionOpts(opts)}
        onRefresh={() => getStudentsByPageQuery.refetch()}
        onRowSelectionChanged={(state) => {
          if (state) {
            setIsAddStudentDrawerOpen(false);
            setSelectedStudent(state);
            formSetValue("student_id", state.id);
          }
        }}
      />
    </Drawer>
  );
}
