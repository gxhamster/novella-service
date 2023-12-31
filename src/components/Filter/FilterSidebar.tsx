import { FormProvider, SubmitHandler, UseFormReturn } from "react-hook-form";
import { Group, Button, Accordion, Text } from "@mantine/core";
import { FilterDate, FilterNumber, FilterText } from "./filter";

type FilterFieldType = Record<string, FilterDate | FilterText | FilterNumber>;

type FilterSidebarProps<FormType extends FilterFieldType> = {
  formMethods: UseFormReturn<FormType, any, undefined>;
  onFilterApplied: SubmitHandler<FormType>;
  onFilterReset: () => void;
  defaultFieldValues: FormType;
  children: React.ReactNode;
  defaultOpenedGroups?: Array<string>;
};

export default function FilterSidebar<FormType extends FilterFieldType>({
  formMethods,
  onFilterApplied: filterApplied,
  onFilterReset,
  defaultFieldValues,
  children,
  defaultOpenedGroups = [],
}: FilterSidebarProps<FormType>) {
  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={formMethods.handleSubmit(filterApplied)}
        className="min-w-[320px] max-w-[320px]  overflow-scroll h-full max-h-full py-7 px-5 bg-dark-8 border-r-[1px] border-dark-4"
      >
        <Group justify="space-between">
          <Text size="sm" fw="bold" c="dark.2">
            Filters
          </Text>
          <Group gap={5}>
            <Button
              color="gray"
              variant="light"
              size="xs"
              type="button"
              onClick={(event) => {
                event.preventDefault();
                formMethods.reset(defaultFieldValues);
                onFilterReset();
                // Reset the filters to default here
                // setFilterOpts((current) => ({
                //   ...current,
                //   filters: filterDefaultValues,
                // }));
              }}
            >
              Cancel
            </Button>
            <Button variant="light" size="xs" type="submit">
              Save
            </Button>
          </Group>
        </Group>
        <Accordion
          radius="md"
          chevronPosition="left"
          defaultValue={defaultOpenedGroups}
          multiple
          mt={20}
          styles={{
            control: {
              borderRadius: "var(--mantine-radius-sm)",
            },
            chevron: {
              margin: "10px",
            },
            content: {
              padding: "0px",
            },
            item: {
              borderWidth: "0px",
            },
          }}
        >
          {/* Filter Groups go here */}
          {children}
        </Accordion>
      </form>
    </FormProvider>
  );
}
