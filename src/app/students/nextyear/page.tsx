"use client";
import { AcademicIllustration } from "./AcademicIllustration";
import { trpc } from "@/app/_trpc/client";
import { useEffect, useMemo, useState } from "react";
import { getAllStudentsType } from "@/server/routes/student";
import NovellaDataTable from "@/components/NovellaDataTable";
import { createColumnHelper } from "@tanstack/react-table";
import CheckIcon from "@/components/icons/CheckIcon";
import {
  Badge,
  Button,
  Title,
  Text,
  Select,
  Popover,
  ActionIcon,
  NumberInput,
  Tooltip,
  Modal,
  Stack,
  Group,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import EditIcon from "@/components/icons/EditIcon";
import AddIcon from "@/components/icons/AddIcon";
import MinusIcon from "@/components/icons/MinusIcon";
import { Toast } from "@/components/Toast";
import TrashIcon from "@/components/icons/TrashIcon";
import NDeleteModal from "@/components/NDeleteModal";
import CloseIcon from "@/components/icons/CloseIcon";

interface getAllStudentsTypeDef extends getAllStudentsType {
  new_grade: number | null;
  status: "Changed" | "No change" | "Deleted";
}

type ConfirmChangesModalProps = {
  saveButtonLoading: boolean;
  opened: boolean;
  onClose: () => void;
  onCancel: () => void;
  onSave: () => void;
};
function ConfirmChangesModal({
  saveButtonLoading,
  opened,
  onCancel,
  onSave,
  onClose,
}: ConfirmChangesModalProps) {
  return (
    <Modal opened={opened} onClose={onClose} title="Confirm changes" centered>
      <Text size="md" c="dark.1">
        The changes you created have not been saved yet. Press continue to
        continue without saving.
      </Text>
      <Group mt="xl" justify="flex-end">
        <Button variant="default" color="gray" onClick={onCancel}>
          Continue
        </Button>
        <Button loading={saveButtonLoading} onClick={onSave}>
          Save changes
        </Button>
      </Group>
    </Modal>
  );
}

type EditPopoverProps = {
  onIndexChanged: (index: number | string) => void;
  disabled: boolean;
};
function EditPopover({ onIndexChanged, disabled }: EditPopoverProps) {
  const [index, setIndex] = useState<number | string>();

  return (
    <Popover trapFocus width={200} position="bottom" withArrow shadow="md">
      <Popover.Target>
        <ActionIcon variant="light" color="gray" disabled={disabled}>
          <EditIcon size={16} />
        </ActionIcon>
      </Popover.Target>
      <Popover.Dropdown>
        <Stack>
          <NumberInput
            placeholder="Enter new index"
            label="Index"
            size="xs"
            onChange={setIndex}
          />
          <Button
            size="xs"
            color="gray"
            onClick={() => {
              if (index) onIndexChanged(index);
            }}
          >
            Save
          </Button>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
}

export default function Nextyear() {
  const [showStudents, setShowStudents] = useState<boolean>(false);
  const [selectedGrade, setSelectedGrade] = useState<number>();
  const [tempSelectedGrade, setTempSelectedGrade] = useState<number>();
  const [studentData, setStudentData] = useState<getAllStudentsTypeDef[]>();
  const [changedGradeIncrement, setChangedGradeIncrement] = useState<number>(0);
  const [
    saveChangesModalOpened,
    { close: saveChangesModalClose, open: saveChangesModalOpen },
  ] = useDisclosure(false);
  const [
    deleteModalOpened,
    { close: deleteModalClose, open: deleteModalOpen },
  ] = useDisclosure(false);

  const statusChanged = useMemo(() => {
    const changedStudents = studentData?.filter(
      (student) => student.status === "Changed" || student.status === "Deleted"
    );
    if (changedStudents && changedStudents?.length > 0) {
      return true;
    }
    return false;
  }, [selectedGrade, studentData]);
  const getStudentQuery = trpc.students.getAllStudents.useQuery(undefined, {
    enabled: false,
  });
  const changeAcademicMutation = trpc.students.changeAcademic.useMutation({
    onError: (error) => {
      Toast.Error({
        title: "Could not update students data",
        message: error.message,
      });
      saveChangesModalClose();
    },
    onSuccess: () => {
      Toast.Successful({
        title: "Successful",
        message: "New student changes has been applied",
      });
      saveChangesModalClose();
      getStudentQuery.refetch();
      setSelectedGrade(undefined);
    },
  });

  const deleteStudentsInGrade = trpc.students.deleteStudentsById.useMutation({
    onError: (error) => {
      Toast.Error({
        title: "Could not delete students",
        message: error.message,
      });
      saveChangesModalClose();
    },
    onSuccess: () => {
      Toast.Successful({
        title: "Successful",
        message: "The selected students in the grade have been deleted",
      });
      deleteModalClose();
      getStudentQuery.refetch();
      setSelectedGrade(undefined);
    },
  });

  function saveChangesToDB() {
    // Update student information
    const changedStudents = studentData?.filter(
      (student) => student.status === "Changed"
    );
    const dto = changedStudents?.map((student) => ({
      id: student.id,
      grade: student.new_grade || student.grade,
      index: student.index,
    }));

    if (dto && dto.length > 0) changeAcademicMutation.mutate(dto);

    // Delete students that are flagged for delete
    const toDeleteStudents = studentData
      ?.filter((student) => student.status === "Deleted")
      .map((student) => student.id);
    if (toDeleteStudents && toDeleteStudents.length)
      deleteStudentsInGrade.mutate(toDeleteStudents);
  }

  useEffect(() => {
    const allRows: getAllStudentsTypeDef[] | undefined =
      getStudentQuery.data?.data.map((student) => {
        return { ...student, status: "No change", new_grade: null };
      });

    const selectedGradeRows = allRows?.filter(
      (row) => row.grade === selectedGrade
    );

    if (selectedGradeRows?.length) setStudentData(selectedGradeRows);
    else setStudentData(allRows);

    setChangedGradeIncrement(0);
  }, [getStudentQuery.data, selectedGrade]);

  useEffect(() => {
    const newStudentData = studentData?.map((student) => {
      if (student.grade) {
        const newGrade = student.grade + changedGradeIncrement;

        if (!isNaN(changedGradeIncrement) && newGrade !== student.grade) {
          return {
            ...student,
            new_grade: student.grade + changedGradeIncrement,
            status: "Changed",
          } as getAllStudentsTypeDef;
        } else
          return {
            ...student,
            new_grade: student.grade + changedGradeIncrement,
            status: "No change",
          } as getAllStudentsTypeDef;
      }

      return student;
    });

    setStudentData(newStudentData);
  }, [changedGradeIncrement]);

  const columnHelper = createColumnHelper<getAllStudentsTypeDef>();
  const tanstackCols = [
    columnHelper.accessor("id", {
      header: "ID",
      cell: (cell) => cell.getValue(),
    }),
    columnHelper.accessor("name", {
      header: "Name",
      cell: (cell) => cell.getValue(),
    }),
    columnHelper.accessor("index", {
      header: "Index",
      cell: (cell) => cell.getValue(),
    }),
    columnHelper.accessor("grade", {
      header: "Current grade",
      cell: (cell) => cell.getValue(),
    }),
    columnHelper.accessor("new_grade", {
      header: "New Grade",
      cell: (props) => props.getValue(),
    }),
    columnHelper.display({
      header: "Actions",
      cell: (props) => (
        <Group>
          <EditPopover
            disabled={!selectedGrade}
            onIndexChanged={(index) => {
              const studentDataWithChangedIndex = studentData?.map((row) => {
                if (row.id === props.row.original.id) {
                  return {
                    ...row,
                    index: Number(index),
                    status: index !== row.index ? "Changed" : "No change",
                  } as getAllStudentsTypeDef;
                }
                return row;
              });
              setStudentData(studentDataWithChangedIndex);
            }}
          />
          <ActionIcon
            variant="light"
            color="red"
            disabled={!selectedGrade}
            onClick={() => {
              const studentDataWithChangedIndex = studentData?.map((row) => {
                if (row.id === props.row.original.id) {
                  return {
                    ...row,
                    status: row.status !== "Deleted" ? "Deleted" : "No change",
                  } as getAllStudentsTypeDef;
                } else return row;
              });
              setStudentData(studentDataWithChangedIndex);
            }}
          >
            <TrashIcon size={16} />
          </ActionIcon>
        </Group>
      ),
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (props) => {
        const getBadgeColor = (status: "Changed" | "Deleted" | "No change") => {
          switch (status) {
            case "Changed":
              return "green";
            case "Deleted":
              return "red";
            default:
              return "gray";
          }
        };
        return (
          <Badge variant="light" color={getBadgeColor(props.getValue())}>
            {props.getValue()}
          </Badge>
        );
      },
    }),
  ];
  return (
    <div className="flex flex-col text-surface-900 gap-y-3 relative max-h-full overflow-y-auto flex-grow px-20 ">
      <section className="flex flex-col justify-center items-center">
        <section className="flex flex-col justify-center items-center mt-10">
          <Title order={1} fw="normal" c="dark.1">
            Academic year
          </Title>
          <Title c="dark.2" order={4} fw="normal">
            Allows to transfer all registered library students to the next
            academic year
          </Title>
        </section>
        <section className="flex flex-col justify-center">
          <AcademicIllustration size={200} />
          <Button
            color="gray"
            disabled={showStudents}
            size="md"
            onClick={() => {
              setShowStudents(true);
              getStudentQuery.refetch();
            }}
          >
            Review changes
          </Button>
        </section>
      </section>

      {showStudents && (
        <section className="m-10 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <Text size="xl" c="dark.1">
              Review changes
            </Text>
            <Text size="md" c="dark.2">
              Review the proposed changes that will be made to the students
              information
            </Text>
          </div>
          <div className="flex flex-col">
            <Group justify="flex-start" align="start" mb={15}>
              <Tooltip label="Decrement current grade">
                <ActionIcon
                  size="lg"
                  color="dark"
                  disabled={!selectedGrade}
                  variant="default"
                  onClick={() => {
                    setChangedGradeIncrement((current) => current - 1);
                  }}
                >
                  <MinusIcon size={10} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Increment current grade">
                <ActionIcon
                  size="lg"
                  disabled={!selectedGrade}
                  color="dark"
                  variant="default"
                  onClick={() => {
                    setChangedGradeIncrement((current) => current + 1);
                  }}
                >
                  <AddIcon size={10} />
                </ActionIcon>
              </Tooltip>
              <Select
                size="sm"
                autoFocus
                variant="filled"
                placeholder="Pick grade"
                value={String(selectedGrade)}
                onChange={(value) => {
                  const anyChangesMade = studentData?.filter(
                    (data) => data.status === "Changed"
                  );
                  if (selectedGrade && anyChangesMade?.length) {
                    setTempSelectedGrade(Number(value));
                    saveChangesModalOpen();
                  } else setSelectedGrade(Number(value));
                }}
                data={getStudentQuery.data?.data
                  ?.map((record) => record.grade)
                  .filter((grade, idx, array) => idx === array.indexOf(grade))
                  .map((grade) => String(grade))}
              />
            </Group>
            <NovellaDataTable<getAllStudentsTypeDef>
              columns={tanstackCols}
              isDataLoading={getStudentQuery.isLoading}
              isDataRefetching={getStudentQuery.isRefetching}
              data={studentData}
            />
            <Group justify="flex-end" align="start" mt={15}>
              <Button
                color="red.9"
                size="sm"
                disabled={!selectedGrade}
                onClick={deleteModalOpen}
                leftSection={<TrashIcon size={16} />}
              >
                Delete grade
              </Button>
              <Button
                size="sm"
                variant="default"
                disabled={!statusChanged}
                onClick={() => {
                  if (getStudentQuery.data?.data) {
                    // Only update the status of the students in the current view of the table
                    const currentStudentsInViewByID = studentData?.map(
                      (student) => student.id
                    );
                    const studentQueryCurrentStudents =
                      getStudentQuery.data.data.filter((student) =>
                        currentStudentsInViewByID?.includes(student.id)
                      );
                    const newStudentData: getAllStudentsTypeDef[] =
                      studentQueryCurrentStudents.map((student) => {
                        return {
                          ...student,
                          new_grade: null,
                          status: "No change",
                        };
                      });
                    setStudentData([...newStudentData]);
                  }
                }}
                leftSection={<CloseIcon size={10} />}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                disabled={!statusChanged}
                leftSection={<CheckIcon size={10} />}
                onClick={() => {
                  saveChangesModalOpen();
                }}
                loading={changeAcademicMutation.isLoading}
              >
                Save changes
              </Button>
            </Group>
          </div>
          <ConfirmChangesModal
            saveButtonLoading={
              changeAcademicMutation.isLoading ||
              deleteStudentsInGrade.isLoading
            }
            opened={saveChangesModalOpened}
            onClose={saveChangesModalClose}
            onCancel={() => {
              setSelectedGrade(tempSelectedGrade);
              saveChangesModalClose();
            }}
            onSave={() => {
              saveChangesToDB();
            }}
          />
          <NDeleteModal
            isOpen={deleteModalOpened}
            closeModal={deleteModalClose}
            isDeleting={deleteStudentsInGrade.isLoading}
            onDelete={() => {
              if (studentData) {
                const studentsIdToDelete = studentData.map(
                  (student) => student.id
                );
                deleteStudentsInGrade.mutate(studentsIdToDelete);
              }
            }}
          />
        </section>
      )}
    </div>
  );
}
