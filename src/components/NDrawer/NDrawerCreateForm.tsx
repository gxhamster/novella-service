"use client";
import {
  FieldValues,
  useForm,
  DefaultValues,
  FieldError,
} from "react-hook-form";
import NDrawer from "@/components/NDrawer/NDrawer";
import NovellaInput from "@/components/NovellaInput";
import ButtonGhost from "@/components/ButtonGhost";
import ButtonPrimary from "@/components/ButtonPrimary";
import LoadingIcon from "@/components/icons/LoadingIcon";
import { NDrawerCreateFormFieldsType } from ".";

// Related to react-hook-form
type AsyncDefaultValues<TFieldValues> = (
  payload?: unknown
) => Promise<TFieldValues>;

type NDrawerCreateStudentProps<TableType> = {
  isOpen: boolean;
  closeDrawer: () => void;
  title: string;
  onFormSubmit: (formData: TableType) => void;
  saveButtonLoadingState: boolean;
  formFieldsCategories: Array<NDrawerCreateFormFieldsType<TableType>>;
  defaultValues: DefaultValues<TableType> | AsyncDefaultValues<TableType>;
};

export default function NDrawerCreateForm<TableType extends FieldValues>({
  isOpen,
  closeDrawer,
  title,
  onFormSubmit,
  saveButtonLoadingState,
  formFieldsCategories,
  defaultValues,
}: NDrawerCreateStudentProps<TableType>) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TableType>({
    defaultValues: defaultValues,
  });

  return (
    <NDrawer isOpen={isOpen} closeDrawer={closeDrawer} title={title}>
      <div className="flex flex-col justify-between h-[calc(100vh-57px)] overflow-y-auto">
        <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col">
          {formFieldsCategories.map((category) => (
            <div
              key={category.title}
              className="flex flex-col gap-7 border-b-[1px] border-surface-300 p-6"
            >
              {category.title || category.description ? (
                <section className="flex flex-col gap-2">
                  <h3 className="text-md text-surface-800">{category.title}</h3>
                  <span className="text-sm text-surface-500">
                    {category.description}
                  </span>
                </section>
              ) : null}
              {category.fields.map((field) => (
                <NovellaInput<typeof field.field>
                  key={field.field}
                  type="text"
                  fontSize="xs"
                  helpText={field.help}
                  reactHookErrorMessage={errors[field.field] as FieldError}
                  reactHookRegister={register(field.field, {
                    valueAsNumber: field.fieldType === "number" ? true : false,
                    disabled: saveButtonLoadingState ? true : field.disabled,
                  })}
                  labelDirection="horizontal"
                  title={field.title}
                />
              ))}
            </div>
          ))}
          <div className="flex justify-end p-3 gap-2">
            <ButtonGhost
              title="Cancel"
              onClick={(e) => {
                e.preventDefault();
                reset();
                closeDrawer();
              }}
            />
            <ButtonPrimary
              disabled={saveButtonLoadingState}
              icon={
                saveButtonLoadingState ? (
                  <LoadingIcon className="text-surface-900" size={18} />
                ) : null
              }
              title="Save"
            />
          </div>
        </form>
      </div>
    </NDrawer>
  );
}
