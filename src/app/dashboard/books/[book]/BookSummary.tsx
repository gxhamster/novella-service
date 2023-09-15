"use client";
import ButtonPrimary from "@/components/ButtonPrimary";
import ButtonSecondary from "@/components/ButtonSecondary";
import NovellaInput from "@/components/NovellaInput";
import { IBook } from "@/types/supabase";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import BookCategoryCard from "./BookCatergoryCard";
import { useRouter } from "next/navigation";
import BookDeleteCard from "./BookDeleteCard";
import BookDeleteModal from "./BookDeleteModal";

export default function BookSummary({ data }: { data: IBook }) {
  let defaultInputValues = {};
  Object.assign(defaultInputValues, data);
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<IBook>({
    defaultValues: defaultInputValues,
  });

  const router = useRouter();
  const formWatchedValues = useWatch({ control });
  const [formValuesChangedFromDefault, setFormValuesChangedFromDefault] =
    useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const onSubmit: SubmitHandler<IBook> = async (formData) => {
    (Object.keys(formData) as (keyof typeof formData)[]).forEach((key) => {
      formData[key] === undefined && delete formData[key];
    });

    let filteredFormData = formData;

    const { data: result, error } = await fetch(`/api/books?id=${data.id}`, {
      cache: "no-cache",
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(filteredFormData),
    }).then((res) => res.json());

    if (error) {
      throw new Error(error.message, {
        cause: `Error occured when trying to update book with ID: ${data.id}`,
      });
    } else {
      router.refresh();
      setFormValuesChangedFromDefault(false);
    }
  };

  const deleteModalCloseHandler = async () => {
    setIsDeleteModalOpen(false);

    const { error } = await fetch(`/api/books?id=${data.id}`, {
      method: "DELETE",
    }).then((res) => res.json());
    if (error) {
      throw new Error(error.message);
    }
  };

  type BookField = {
    title: string;
    field: keyof IBook;
    disabled: boolean;
  };

  type BookCategory = {
    title: string;
    description: string;
    fields: BookField[];
  };

  const categories: BookCategory[] = [
    {
      title: "General information",
      description: "Edit the general information about the book",
      fields: [
        {
          title: "Title",
          field: "title",
          disabled: false,
        },
        {
          title: "Author",
          field: "author",
          disabled: false,
        },
        {
          title: "Reference ID",
          field: "id",
          disabled: true,
        },
      ],
    },
    {
      title: "Publisher information",
      description: "Edit the publisher information about the book",
      fields: [
        {
          title: "Publisher",
          field: "publisher",
          disabled: false,
        },
        {
          title: "Edition",
          field: "edition",
          disabled: false,
        },
        {
          title: "Year",
          field: "year",
          disabled: false,
        },
      ],
    },
    {
      title: "Identification",
      description: "Edit the information used to identify the book",
      fields: [
        {
          title: "ISBN",
          field: "isbn",
          disabled: false,
        },
        {
          title: "DDC",
          field: "ddc",
          disabled: false,
        },
      ],
    },
    {
      title: "Miscellaneous",
      description: "Edit other informatio about the book",
      fields: [
        {
          title: "Genre",
          field: "genre",
          disabled: false,
        },
        {
          title: "Language",
          field: "language",
          disabled: false,
        },
        {
          title: "Pages",
          field: "pages",
          disabled: false,
        },
      ],
    },
    {
      title: "User Information",
      description: "The user who created the book",
      fields: [
        {
          title: "User ID",
          field: "user_id",
          disabled: true,
        },
      ],
    },
  ];

  function checkIfFieldsChanged() {
    let key: keyof typeof formWatchedValues;
    let result = false;
    for (key in formWatchedValues) {
      if (formWatchedValues[key] != undefined) {
        if (formWatchedValues[key] !== data[key]) result = true;
      }
    }

    return result;
  }

  // Check whether the input values are same as the default values
  useEffect(() => {
    const result = checkIfFieldsChanged();
    setFormValuesChangedFromDefault(result);
  }, [formWatchedValues]);

  return (
    <div className="relative">
      <div className="flex flex-col fixed">
        <span className="text-surface-800 mb-3">Contents</span>
        {categories.map((category) => (
          <a
            key={category.title}
            href={`#${category.title}`}
            className="py-2 px-3 text-sm font-light text-surface-600 border-l-[1px] border-surface-400 hover:text-surface-900 hover:border-surface-600 focus:border-l-[1px] focus:border-primary-400 focus:text-surface-900"
          >
            {category.title}
          </a>
        ))}
      </div>
      <div className="flex-grow ml-[18rem] flex flex-col gap-8">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-2xl text-surface-700 font-light">
                Books / Ref:{" "}
                <span className="text-surface-900 text-3xl"> {data.id}</span>
              </h3>
            </div>
            <div className="flex gap-2">
              <ButtonSecondary
                onClick={(e) => {
                  e.preventDefault();
                  reset(data);
                }}
                disabled={!formValuesChangedFromDefault}
                title="Cancel"
              />
              <ButtonPrimary
                disabled={!formValuesChangedFromDefault}
                title="Save"
              />
            </div>
          </div>
          {categories.map((category) => (
            <BookCategoryCard
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
                    disabled: field.disabled,
                  })}
                  reactHookErrorMessage={errors[field.field]}
                ></NovellaInput>
              ))}
            </BookCategoryCard>
          ))}
        </form>
        <BookDeleteCard onClick={() => setIsDeleteModalOpen(true)} />
        <BookDeleteModal
          title={`Confirm deletion of book Ref: ${data.id}`}
          description="This will permanently delete the book from the database and cannot be recovered"
          isOpen={isDeleteModalOpen}
          closeModal={deleteModalCloseHandler}
        />
      </div>
    </div>
  );
}
