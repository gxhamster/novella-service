"use client";
import {
  DataTable,
  DataTableContent,
  DataTableControls,
} from "@/components/DataTable";
import {
  ActionIcon,
  Box,
  Button,
  Flex,
  LoadingOverlay,
  Modal,
  Popover,
  Stack,
  Stepper,
} from "@mantine/core";
import { useRouter } from "next/navigation";
import { Group, Text, Badge, rem } from "@mantine/core";
import {
  IconUpload,
  IconFileTypeCsv,
  IconX,
  IconAlertCircle,
  IconDatabaseImport,
  IconDeviceFloppy,
  IconArrowLeft,
  IconArrowRight,
  IconCircleCheck,
  IconFileSpreadsheet,
  IconCircleCheckFilled,
} from "@tabler/icons-react";
import { Dropzone, MIME_TYPES } from "@mantine/dropzone";
import { useMemo, useState } from "react";
import Papa from "papaparse";
import { createColumnHelper } from "@tanstack/react-table";
import { ZStudentInsert } from "@/supabase/schema";
import { SafeParseError } from "zod";
import { useDisclosure } from "@mantine/hooks";
import { trpc } from "../_trpc/client";
import { Toast } from "@/components/Toast";
import { Tables, TablesInsert } from "@/supabase/types/types";

type PreviewModalProps = {
  onFileSelected: (file: File) => void;
};

type StatusBadegeProps = {
  status: "Valid" | "Invalid";
};

function StatusBadge({ status }: StatusBadegeProps) {
  switch (status) {
    case "Valid":
      return (
        <Badge variant="light" color="green">
          Valid
        </Badge>
      );
    case "Invalid":
      return (
        <Badge variant="light" color="red">
          Invalid
        </Badge>
      );
  }
}

function FileDropzone({ onFileSelected }: PreviewModalProps) {
  const [selected, setSelected] = useState<File | null>(null);
  return (
    <Dropzone
      onDrop={(files) => {
        onFileSelected(files[0]);
        setSelected(files[0]);
      }}
      onReject={(files) => console.log("rejected files", files)}
      maxSize={5 * 1024 ** 2}
      accept={[MIME_TYPES.csv]}
    >
      <Group
        justify="center"
        gap="xl"
        mih={220}
        style={{ pointerEvents: "none" }}
      >
        <Dropzone.Accept>
          <IconUpload
            style={{
              width: rem(52),
              height: rem(52),
              color: "var(--mantine-color-blue-6)",
            }}
            stroke={1.5}
          />
        </Dropzone.Accept>
        <Dropzone.Reject>
          <IconX
            style={{
              width: rem(52),
              height: rem(52),
              color: "var(--mantine-color-red-6)",
            }}
            stroke={1.5}
          />
        </Dropzone.Reject>
        <Dropzone.Idle>
          <IconFileTypeCsv
            style={{
              width: rem(52),
              height: rem(52),
              color: "var(--mantine-color-dimmed)",
            }}
            stroke={1.5}
          />
        </Dropzone.Idle>
        {!selected ? (
          <div>
            <Text size="xl" inline>
              Drag csv files here or click to select files
            </Text>
            <Text size="sm" c="dimmed" inline mt={7}>
              Only file can be imported at a time, each file should not exceed
              5mb
            </Text>
          </div>
        ) : (
          <div>
            <Text size="xl" inline>
              Selected a file
            </Text>

            <Text size="sm" c="dimmed" inline mt={7}>
              {`${selected.name}`}
            </Text>
          </div>
        )}{" "}
      </Group>
    </Dropzone>
  );
}

type CellInformationProps = {
  message: string;
};
function CellInformation({ message }: CellInformationProps) {
  const [opened, { close, open }] = useDisclosure(false);
  return (
    <Popover
      width={200}
      position="bottom"
      variant="light"
      withArrow
      shadow="lg"
      opened={opened}
    >
      <Popover.Target>
        <ActionIcon
          radius="xl"
          size="sm"
          onMouseEnter={open}
          onMouseLeave={close}
          variant="light"
          color="red"
        >
          <IconAlertCircle />
        </ActionIcon>
      </Popover.Target>
      <Popover.Dropdown style={{ pointerEvents: "none" }}>
        <Text size="sm">{message}</Text>
      </Popover.Dropdown>
    </Popover>
  );
}

type ImportTableProps = {
  data: Array<Record<string, any>>;
  onIsTableErr: (isError: boolean) => void;
};

function ImportTable({ data, onIsTableErr }: ImportTableProps) {
  const [pageSettings, setPageSettings] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const columnHelper = createColumnHelper<any>();
  const sampleHeaders = [
    { id: "name", header: "Name" },
    { id: "island", header: "Island" },
    { id: "address", header: "Address" },
    { id: "phone", header: "Phone" },
    { id: "grade", header: "Grade" },
    { id: "index", header: "Index" },
  ];

  const columns = [
    columnHelper.accessor("row", {
      header: "Row #",
      cell: (prop) => prop.getValue(),
    }),
    ...sampleHeaders.map((header) =>
      columnHelper.accessor(header.id, {
        header: header.header,
        cell: (prop) => (
          <>
            <Group gap={5} align="center" justify="space-between">
              <Text size="xs">{prop.getValue()?.value}</Text>
              {prop.getValue()?.message && (
                <CellInformation message={prop.getValue()?.message} />
              )}
            </Group>
          </>
        ),
      })
    ),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (prop) => <StatusBadge status={prop.getValue()} />,
    }),
  ];

  const pagedData = useMemo(() => {
    const errorStatusPerRow = data.map((dataRow, index) => {
      const parsed = ZStudentInsert.safeParse(dataRow) as SafeParseError<
        typeof dataRow
      >;

      const fieldErrWithMessage: Record<string, string> = {};
      parsed?.error?.issues.forEach((err) => {
        fieldErrWithMessage[String(err.path[0])] = err.message;
      });

      let dataRowWithErr: Record<string, any> = {};
      for (const field in dataRow) {
        const errMessage =
          field in fieldErrWithMessage ? fieldErrWithMessage[field] : "";
        const value = dataRow[field] || null;
        dataRowWithErr[field] = { value, message: errMessage };
      }

      return {
        ...dataRowWithErr,
        row: index + 1,
        status: parsed.success ? "Valid" : "Invalid",
      };
    });

    const startIdx = pageSettings.pageIndex * pageSettings.pageSize;
    const endIdx = pageSettings.pageSize * (pageSettings.pageIndex + 1);

    const isAnyRowErr = errorStatusPerRow.filter(
      (row) => row.status === "Invalid"
    );
    if (isAnyRowErr.length) onIsTableErr(true);
    else onIsTableErr(false);

    return errorStatusPerRow.slice(startIdx, endIdx);
  }, [data, pageSettings]);

  return (
    <>
      <DataTable
        onPaginationChanged={(pageIndex, pageSize) =>
          setPageSettings({ pageIndex, pageSize })
        }
        totalDataCount={data.length}
        isDataLoading={false}
        isDataRefetching={false}
        data={pagedData}
        columns={columns}
      >
        <DataTableContent spacing="xs" />
        <DataTableControls />
      </DataTable>
    </>
  );
}

function SampleTable() {
  const sampleColHelper = createColumnHelper<TablesInsert<"students">>();
  const sampleHeaders = [
    { id: "name" },
    { id: "island" },
    { id: "address" },
    { id: "phone" },
    { id: "grade" },
    { id: "index" },
  ];

  const tanstackCols = sampleHeaders.map((col) =>
    sampleColHelper.accessor(col.id as keyof TablesInsert<"students">, {
      header: col.id,
      cell: (props) => props.getValue(),
    })
  );

  const sampleData: Array<TablesInsert<"students">> = [
    {
      name: "Student 1",
      island: "Island 1",
      address: "Address 1",
      phone: "7567525",
      grade: 6,
      index: 5675,
    },
  ];

  return (
    <Stack gap={10} mt={15}>
      <Text c="gray">Sample table</Text>
      <DataTable
        totalDataCount={sampleData.length}
        isDataLoading={false}
        isDataRefetching={false}
        data={sampleData}
        columns={tanstackCols}
      >
        <DataTableContent spacing="xs" />
      </DataTable>
    </Stack>
  );
}

export default function ImportPreview() {
  const router = useRouter();
  const [parsedFile, setParsedFile] = useState<Array<any> | null>(null);
  const [active, setActive] = useState(0);
  const nextStep = () =>
    setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));
  const [isTableError, setIsTableError] = useState(false);
  const [uploadFinished, setIsUploadFinished] = useState(false);

  const allowNextStep = useMemo(() => {
    switch (active) {
      case 0:
        return parsedFile ? true : false;
      case 1:
        return !isTableError;
      case 2:
        return uploadFinished;
      default:
        return false;
    }
  }, [parsedFile, isTableError, uploadFinished, active]);

  const allowPrevStep = useMemo(() => {
    switch (active) {
      case 0:
      case 3:
        return false;
      case 2:
        return !uploadFinished;
      default:
        return true;
    }
  }, [uploadFinished, active]);

  const insertStudentMutation = trpc.students.createStudents.useMutation({
    onError: (error) => {
      Toast.Error({
        title: "Cannot commit",
        message: error.message,
      });
    },
    onSuccess: () => {
      setIsUploadFinished(true);
      nextStep();
      router.refresh();
      Toast.Successful({
        message: "Successfully imported students to the library",
        title: "Successful",
      });
    },
  });

  function upload() {
    const acceptedFields = [
      "name",
      "address",
      "island",
      "phone",
      "grade",
      "index",
    ];
    const recordsToUpload: Array<TablesInsert<"students">> = [];
    // FIXME: Get rid of the any types. When assigning a key in newRecord it shows never.
    if (!parsedFile) return;
    for (const record of parsedFile) {
      let newRecord: any = {
        index: 0,
      };

      for (let field in record) {
        if (acceptedFields.includes(field)) {
          newRecord[field] = record[field];
        }
      }
      recordsToUpload.push(newRecord);
    }

    // Upload to database
    console.log(recordsToUpload);
    insertStudentMutation.mutate(recordsToUpload);
  }

  return (
    <Modal
      opened
      onClose={router.back}
      fullScreen
      title={
        <Group gap={5}>
          <IconUpload color="gray" stroke={1.5} />
          <Text c="gray">Import student records</Text>
        </Group>
      }
      radius="md"
    >
      <Box pos="relative" p={20}>
        <LoadingOverlay
          visible={insertStudentMutation.isLoading}
          styles={{
            overlay: {
              backgroundColor: "rgba(36,36,36,0.2)",
            },
          }}
          zIndex={1000}
          overlayProps={{ radius: "lg", blur: 1 }}
        />
        <Stepper
          active={active}
          color="green.6"
          onStepClick={setActive}
          completedIcon={
            <IconCircleCheck style={{ width: rem(18), height: rem(18) }} />
          }
          allowNextStepsSelect={allowNextStep}
        >
          <Stepper.Step
            icon={
              <IconFileSpreadsheet
                style={{ width: rem(18), height: rem(18) }}
              />
            }
            label="First step"
            description="Select file"
          >
            <FileDropzone
              onFileSelected={(file) => {
                Papa.parse(file, {
                  header: true,
                  dynamicTyping: true,
                  skipEmptyLines: true,
                  complete: function (results: any) {
                    console.log(results.data);
                    setParsedFile(results.data);
                  },
                });
              }}
            />
            <SampleTable />
          </Stepper.Step>
          <Stepper.Step
            icon={
              <IconAlertCircle style={{ width: rem(18), height: rem(18) }} />
            }
            label="Second step"
            description="Check for errors"
            color={isTableError ? "red" : "green.6"}
          >
            <ImportTable
              onIsTableErr={(isError) => setIsTableError(isError)}
              data={parsedFile || []}
            />
          </Stepper.Step>

          <Stepper.Step
            icon={<IconUpload style={{ width: rem(20), height: rem(20) }} />}
            label="Third step"
            description="Commit records"
          >
            <Stack justify="center" align="center" p={20} gap={40}>
              <IconDatabaseImport size={120} stroke={0.5} color="#9e9e9e" />
              <Button
                variant="filled"
                size="sm"
                loading={insertStudentMutation.isLoading}
                onClick={upload}
                leftSection={<IconDeviceFloppy size={20} />}
              >
                Save to library
              </Button>
            </Stack>
          </Stepper.Step>
          <Stepper.Completed>
            <Group justify="center" p={20}>
              <IconCircleCheckFilled
                size={50}
                stroke={0.5}
                style={{ color: "#40bf56" }}
              />
              <Stack gap={5}>
                <Text size="xl" inline>
                  Import successful
                </Text>
                <Text size="sm" c="dimmed" mt={7}>
                  The imported records have been commited to the library and
                  will now be visible.
                </Text>
              </Stack>
            </Group>
          </Stepper.Completed>
        </Stepper>
        <Group justify="center" mt="xl">
          <Button
            size="xs"
            leftSection={<IconArrowLeft />}
            variant="default"
            disabled={!allowPrevStep}
            onClick={() => {
              setIsTableError(false);
              prevStep();
            }}
          >
            Back
          </Button>
          <Button
            size="xs"
            variant="default"
            onClick={nextStep}
            rightSection={<IconArrowRight />}
            disabled={!allowNextStep}
          >
            Next step
          </Button>
        </Group>
      </Box>
    </Modal>
  );
}
