"use client";
import { useForm, useWatch } from "react-hook-form";
import { useEffect, useState } from "react";
import { IStudent } from "@/supabase/types/supabase";
import ButtonPrimary from "@/components/ButtonPrimary";
import ButtonSecondary from "@/components/ButtonSecondary";
import NCategoryCard from "@/components/NCategoryCard";
import NovellaInput from "@/components/NovellaInput";

type NTableOfContentsProps = {
  links: Array<{ href: string; title: string }>;
};

function NTableOfContents({ links }: NTableOfContentsProps) {
  return (
    <div className="flex flex-col fixed">
      <span className="text-surface-800 mb-3">Contents</span>
      {links.map(({ href, title }) => (
        <a
          key={href}
          href={`#${href}`}
          className="py-2 px-3 text-sm font-light text-surface-600 border-l-[1px] border-surface-400 hover:text-surface-900 hover:border-surface-600 focus:border-l-[1px] focus:border-primary-400 focus:text-surface-900"
        >
          {title}
        </a>
      ))}
    </div>
  );
}

type StudentFieldsCategories<T> = {
  title: string;
  description: string;
  fields: Array<{
    title: string;
    field: keyof T;
    disabled: boolean;
  }>;
};
const categories: StudentFieldsCategories<IStudent>[] = [
  {
    title: "General Information",
    description: "Edit the general information about the student",
    fields: [
      {
        title: "ID",
        field: "id",
        disabled: true,
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
  }, [currentFormValues]);

  return result;
}

type StudentProps = {
  params: { student: string };
};
export default function Student({ params }: StudentProps) {
  const [studentData, setStudentData] = useState<IStudent | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<IStudent>();
  const watchedFormValues = useWatch({ control });
  const formValuesChanged = useFormValuesChanged({
    srcData: studentData,
    currentFormValues: watchedFormValues,
  });

  async function getStudentData() {
    const { data, error } = await fetch(
      `/api/students?id=${params.student}`
    ).then((response) => response.json());
    if (error) throw new Error(error.message);
    else {
      setStudentData(data);
      // Set useForm default values
      reset(data);
    }
  }

  function studentFormSubmitHandler(formData: IStudent) {
    const keys = Object.keys(formData) as Array<keyof IStudent>;
    let filteredFormData = { ...formData };
    for (const key of keys) {
      if (filteredFormData[key] == undefined) delete filteredFormData[key];
    }

    async function updateStudent() {
      const { _, error } = await fetch(`/api/students?id=${params.student}`, {
        cache: "no-cache",
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filteredFormData),
      }).then((res) => res.json());

      if (error) throw new Error(error.message);
    }
    updateStudent();
    getStudentData();
  }

  useEffect(() => {
    getStudentData();
  }, []);

  return (
    <div className="m-16 flex flex-col text-surface-900 gap-y-3">
      <NTableOfContents links={categoryLinks} />
      <section className="flex-grow ml-[18rem] flex flex-col gap-8">
        {/* Student Information Update Form */}
        <form
          className="flex flex-col gap-8"
          onSubmit={handleSubmit(studentFormSubmitHandler)}
        >
          {/* Title Section */}
          <div className="flex justify-between items-center">
            <h3 className="text-2xl text-surface-700 font-light">{`Student Ref: ${params.student}`}</h3>
            <div className="flex gap-2">
              <ButtonSecondary
                onClick={(e) => {
                  e.preventDefault();
                  if (studentData) reset(studentData);
                }}
                disabled={!formValuesChanged}
                title="Cancel"
              />
              <ButtonPrimary disabled={!formValuesChanged} title="Save" />
            </div>
          </div>
          {categories.map((category) => (
            <NCategoryCard
              title={category.title}
              subtitle={category.description}
            >
              {category.fields.map((field) => (
                <NovellaInput
                  key={field.field}
                  type="text"
                  title={field.title}
                  reactHookRegister={register(field.field, {
                    disabled: field.disabled,
                  })}
                  reactHookErrorMessage={errors[field.field]}
                />
              ))}
            </NCategoryCard>
          ))}
        </form>
      </section>
    </div>
  );
}
