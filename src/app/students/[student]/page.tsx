"use client";
import { useForm, useWatch } from "react-hook-form";
import { useEffect, useState } from "react";
import NCategoryCard from "@/components/NCategoryCard";
import { trpc } from "@/app/_trpc/client";
import { getStudentByIdType } from "@/server/routes/student";
import { Title, Button, TextInput, Alert, Stack, Text } from "@mantine/core";
import AlertIcon from "@/components/icons/AlertIcon";
import { Toast } from "@/components/Toast";
import DeleteModal from "@/components/NDeleteModal";

type StudentFieldsCategories<T> = {
  title: string;
  description: string;
  fields: Array<{
    title: string;
    field: keyof T;
    disabled: boolean;
    isNumber?: boolean;
  }>;
};
const categories: StudentFieldsCategories<getStudentByIdType>[] = [
  {
    title: "General Information",
    description: "Edit the general information about the student",
    fields: [
      {
        title: "ID",
        field: "id",
        disabled: true,
        isNumber: true,
      },
      {
        title: "Created At",
        field: "created_at",
        disabled: true,
      },
      {
        title: "Name",
        field: "name",
        disabled: false,
      },
    ],
  },
  {
    title: "Address Information",
    description: "Edit the students address information",
    fields: [
      {
        title: "Island",
        field: "island",
        disabled: false,
      },
      {
        title: "Address",
        field: "address",
        disabled: false,
      },
    ],
  },
  {
    title: "Miscellaneous",
    description: "Other information about the student",
    fields: [
      {
        title: "Phone",
        field: "phone",
        disabled: false,
      },
      {
        title: "Grade",
        field: "grade",
        disabled: false,
      },
      {
        title: "Index",
        field: "index",
        disabled: false,
        isNumber: true,
      },
    ],
  },
];

type useFormValuesChangedProps<T> = {
  srcData: T;
  currentFormValues: T;
};
function useFormValuesChanged<T>({
  srcData,
  currentFormValues,
}: useFormValuesChangedProps<T>) {
  const [result, setResult] = useState(false);
  useEffect(() => {
    let key: keyof typeof currentFormValues;
    setResult(false);
    for (key in currentFormValues) {
      if (currentFormValues[key] != undefined) {
        if (currentFormValues[key] !== srcData[key]) setResult(true);
      }
    }
  }, [currentFormValues, srcData]);

  return result;
}

type StudentProps = {
  params: { student: string };
};

export default function Student({ params }: StudentProps) {
  if (isNaN(Number(params.student)))
    throw new Error("Book ID should be a number");

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<getStudentByIdType>();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const watchedFormValues = useWatch({ control });

  const getStudentByIdQuery = trpc.students.getStudentById.useQuery(
    Number(params.student)
  );

  const deleteStudentByIdMutation = trpc.students.deleteStudentById.useMutation(
    {
      onError: (_error) => {
        Toast.Error({
          title: "Could not delete student",
          message: _error.message,
        });
        throw new Error(_error.message, {
          cause: _error.data,
        });
      },
      onSuccess: () => {
        Toast.Successful({
          title: "Successful",
          message: "Deleted the student",
        });
        getStudentByIdQuery.refetch();
        if (getStudentByIdQuery.data?.data)
          reset(getStudentByIdQuery.data?.data);
      },
    }
  );

  const updateStudentByIdMutation = trpc.students.updateStudentById.useMutation(
    {
      onError: (_error) => {
        Toast.Error({
          title: "Could not update student",
          message: _error.message,
        });
        throw new Error(_error.message, {
          cause: _error.data,
        });
      },
      onSuccess: () => {
        Toast.Successful({
          title: "Successful",
          message: "Updated the student",
        });
        getStudentByIdQuery.refetch();
        if (getStudentByIdQuery.data?.data)
          reset(getStudentByIdQuery.data?.data);
      },
    }
  );

  const formValuesChanged = useFormValuesChanged({
    srcData: getStudentByIdQuery.data?.data,
    currentFormValues: watchedFormValues,
  });

  function studentFormSubmitHandler(formData: getStudentByIdType) {
    const keys = Object.keys(formData) as Array<keyof getStudentByIdType>;
    let filteredFormData = { ...formData };
    for (const key of keys) {
      if (filteredFormData[key] == undefined) delete filteredFormData[key];
    }

    if (filteredFormData.grade) {
      const grade = parseInt(`${filteredFormData.grade}`);
      filteredFormData = { ...filteredFormData, grade: grade };

      updateStudentByIdMutation.mutate({
        ...filteredFormData,
        id: Number(params.student),
      });
    }
  }

  useEffect(() => {
    if (getStudentByIdQuery.data?.data) reset(getStudentByIdQuery.data.data);
  }, [getStudentByIdQuery.data?.data]);

  return (
    <section className="relative">
      <section className="flex-grow flex flex-col gap-8 m-16">
        {/* Student Information Update Form */}
        <form
          className="flex flex-col gap-8"
          onSubmit={handleSubmit(studentFormSubmitHandler)}
        >
          {/* Title Section */}
          <div className="flex justify-between items-center">
            <Title
              fw="normal"
              order={2}
              c="dark.1"
            >{`Student Ref: ${params.student}`}</Title>
            <div className="flex gap-2">
              <Button
                color="gray"
                size="md"
                disabled={!formValuesChanged}
                onClick={(event) => {
                  event.preventDefault();
                  if (getStudentByIdQuery.data?.data)
                    reset(getStudentByIdQuery.data?.data);
                }}
              >
                Cancel
              </Button>
              <Button
                size="md"
                disabled={!formValuesChanged}
                loading={updateStudentByIdMutation.isLoading}
                type="submit"
              >
                Update
              </Button>
            </div>
          </div>
          {categories.map((category) => (
            <NCategoryCard
              key={category.title}
              title={category.title}
              subtitle={category.description}
            >
              {category.fields.map((field) => (
                <TextInput
                  styles={{
                    label: {
                      color: "var(--mantine-color-dark-1)",
                      fontSize: "var(--mantine-font-size-sm)",
                    },
                  }}
                  size="md"
                  key={field.field}
                  label={field.title}
                  {...register(field.field, {
                    disabled: field.disabled,
                    valueAsNumber: field.isNumber,
                  })}
                />
              ))}
            </NCategoryCard>
          ))}
        </form>

        <Alert
          variant="light"
          color="red"
          title="Delete student from library"
          icon={<AlertIcon size={20} className="" />}
        >
          <Stack justify="flex-start" align="flex-start">
            <Text size="sm" c="red">
              Deleting this student remove it from the database. Please note
              that the student cannot be recovered if deleted.
            </Text>
            <Button
              variant="filled"
              miw={100}
              onClick={() => setIsDeleteModalOpen(true)}
              color="red"
            >
              Delete student
            </Button>
          </Stack>
        </Alert>
        <DeleteModal
          title="Delete student from library"
          description="
              This will permanently delete the student from the database and cannot
              be recovered"
          isOpen={isDeleteModalOpen}
          isDeleting={deleteStudentByIdMutation.isLoading}
          closeModal={() => setIsDeleteModalOpen(false)}
          onDelete={() =>
            deleteStudentByIdMutation.mutate(Number(params.student))
          }
        />
      </section>
    </section>
  );
}
