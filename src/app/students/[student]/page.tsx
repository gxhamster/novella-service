// FIXME: Fetch initial data on server and pass to a client component
"use client";
import { useForm, useWatch } from "react-hook-form";
import { useEffect, useState } from "react";
import NovellaInput from "@/components/NovellaInput";
import NCategoryCard from "@/components/NCategoryCard";
import { trpc } from "@/app/_trpc/client";
import NButton from "@/components/NButton";
import NToast from "@/components/NToast";
import { getStudentByIdType } from "@/server/routes/student";

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

const categoryLinks = categories.map((category) => ({
  href: category.title,
  title: category.title,
}));

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
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<getStudentByIdType>();

  const watchedFormValues = useWatch({ control });

  const getStudentByIdQuery = trpc.students.getStudentById.useQuery(
    Number(params.student)
  );

  const updateStudentByIdMutation = trpc.students.updateStudentById.useMutation(
    {
      onError: (_error) => {
        NToast.error("Could not update student", `${_error.message}`);
        throw new Error(_error.message, {
          cause: _error.data,
        });
      },
      onSuccess: () => {
        NToast.success("Successful", `Updated the student`);
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

    updateStudentByIdMutation.mutate({
      ...formData,
      id: Number(params.student),
    });
  }

  useEffect(() => {
    if (getStudentByIdQuery.data?.data) reset(getStudentByIdQuery.data.data);
  }, [getStudentByIdQuery.data?.data]);

  return (
    <div className="flex text-surface-900 gap-y-3 relative max-h-full overflow-hidden justify-center">
      {/* <NTableOfContents links={categoryLinks} /> */}
      <section className="max-h-full overflow-y-auto flex-grow px-10">
        <section className="flex-grow flex-1 flex-col gap-8 m-16">
          {/* Student Information Update Form */}
          <form
            className="flex flex-col gap-8"
            onSubmit={handleSubmit(studentFormSubmitHandler)}
          >
            {/* Title Section */}
            <div className="flex justify-between items-center">
              <h3 className="text-2xl text-surface-700 font-light">{`Student Ref: ${params.student}`}</h3>
              <div className="flex gap-2">
                <NButton
                  kind="secondary"
                  onClick={(e) => {
                    e.preventDefault();
                    if (getStudentByIdQuery.data?.data)
                      reset(getStudentByIdQuery.data?.data);
                  }}
                  disabled={!formValuesChanged}
                  title="Cancel"
                />
                <NButton
                  kind="primary"
                  disabled={!formValuesChanged}
                  title="Update"
                  isLoading={updateStudentByIdMutation.isLoading}
                />
              </div>
            </div>
            {categories.map((category) => (
              <NCategoryCard
                key={category.title}
                title={category.title}
                subtitle={category.description}
              >
                {category.fields.map((field) => (
                  <NovellaInput
                    key={field.field}
                    type="text"
                    title={field.title}
                    reactHookRegister={register(field.field, {
                      valueAsNumber: field.isNumber,
                      disabled: field.disabled,
                    })}
                    reactHookErrorMessage={errors[field.field]}
                  />
                ))}
              </NCategoryCard>
            ))}
          </form>
        </section>
      </section>
    </div>
  );
}
