"use client";
import { FieldValues, useForm, DefaultValues } from "react-hook-form";
import { NDrawerCreateFormFieldsType } from ".";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Drawer,
  TextInput,
  Text,
  ActionIcon,
  Title,
} from "@mantine/core";

// Related to react-hook-for;
type AsyncDefaultValues<TFieldValues> = (
  payload?: unknown
) => Promise<TFieldValues>;

type NDrawerCreateStudentProps<TableType> = {
  isOpen: boolean;
  closeDrawer: () => void;
  title: string;
  onFormSubmit: (formData: TableType) => void;
  schema?: any;
  saveButtonLoadingState: boolean;
  formFieldsCategories: Array<NDrawerCreateFormFieldsType<TableType>>;
  defaultValues: DefaultValues<TableType> | AsyncDefaultValues<TableType>;
};

export default function NDrawerCreateForm<TableType extends FieldValues>({
  isOpen,
  closeDrawer,
  title,
  onFormSubmit,
  schema = undefined,
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
    resolver: schema ? zodResolver(schema) : undefined,
    defaultValues: defaultValues,
  });

  function selectInputType(type: "number" | "string" | "date") {
    switch (type) {
      case "string":
        return "text";
      case "number":
        return "number";
      case "date":
        return "datetime-local";
      default:
        return "text";
    }
  }

  return (
    <Drawer
      title={title}
      position="right"
      size="lg"
      opened={isOpen}
      onClose={closeDrawer}
    >
      {/* <NDrawer isOpen={isOpen} closeDrawer={closeDrawer} title={title}> */}
      <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col">
        {formFieldsCategories.map((category) => (
          <div
            key={category.title}
            className="flex flex-col gap-7 border-b-[1px] border-surface-300 p-6"
          >
            {category.title || category.description ? (
              <section className="flex flex-col gap-2">
                <Title order={5} c="dark.1">
                  {category.title}
                </Title>
                <Text size="sm" c="dark.2">
                  {category.description}
                </Text>
              </section>
            ) : null}
            {category.fields.map((field) => (
              <TextInput
                type={selectInputType(field.fieldType)}
                key={field.field}
                size="md"
                label={field.title}
                description={field.help}
                {...register(field.field, {
                  required: field.required ? "This field is required" : false,
                  valueAsNumber: field.fieldType === "number" ? true : false,
                  disabled: saveButtonLoadingState ? true : field.disabled,
                })}
              />
              // <NovellaInput<typeof field.field>
              //   key={field.field}
              //   type={selectInputType(field.fieldType)}
              //   fontSize="xs"
              //   helpText={field.help}
              //   reactHookErrorMessage={errors[field.field] as FieldError}
              //   reactHookRegister={register(field.field, {
              //     required: field.required ? "This field is required" : false,
              //     valueAsNumber: field.fieldType === "number" ? true : false,
              //     disabled: saveButtonLoadingState ? true : field.disabled,
              //   })}
              //   labelDirection="horizontal"
              //   title={field.title}
              // />
            ))}
          </div>
        ))}
        <div className="flex justify-end p-3 gap-2">
          <Button
            size="md"
            color="gray"
            onClick={(event) => {
              event.preventDefault();
              reset();
              closeDrawer();
            }}
          >
            Cancel
          </Button>
          <Button
            size="md"
            disabled={saveButtonLoadingState}
            loading={saveButtonLoadingState}
            type="submit"
          >
            Save
          </Button>
          {/* <NButton
            kind="ghost"
            title="Cancel"
            onClick={(e) => {
              e.preventDefault();
              reset();
              closeDrawer();
            }}
          />
          <NButton
            disabled={saveButtonLoadingState}
            isLoading={saveButtonLoadingState}
            title="Save"
          /> */}
        </div>
      </form>
    </Drawer>
  );
}
