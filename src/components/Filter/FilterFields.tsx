import { Stack, TextInput, Switch, NumberInput, Select } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import format from "date-fns/format";
import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

type FilterFieldIDProps<FieldType> = {
  fieldName: string;
};
export function FilterFieldID<FieldType>({
  fieldName,
}: FilterFieldIDProps<FieldType>) {
  const [isRange, setIsRange] = useState(false);
  const {
    control,
    resetField,
    getValues,
    formState: { errors },
  } = useFormContext();

  useEffect(() => {
    if (!isRange) {
      resetField(`${fieldName}.end`);
    }
  }, [isRange, fieldName, resetField]);

  return (
    <Stack gap={10} mt={10}>
      <Controller
        control={control}
        name={`${fieldName}.start`}
        render={({ field: { onChange, onBlur, value } }) => (
          <NumberInput
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            styles={{
              label: {
                fontSize: "var(--mantine-font-size-xs)",
                color: "var(--mantine-color-dark-1)",
              },
            }}
            label="Start"
            placeholder="Eg: 327"
            max={Infinity}
          />
        )}
      />
      {isRange && (
        <Controller
          control={control}
          name={`${fieldName}.end`}
          rules={{
            validate: {
              largerThanStart: (value) => {
                if (getValues()[`${fieldName}`].start > value) {
                  return false;
                }
                return true;
              },
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <NumberInput
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              styles={{
                label: {
                  fontSize: "var(--mantine-font-size-xs)",
                  color: "var(--mantine-color-dark-1)",
                },
              }}
              step={1}
              error={
                (errors[`${fieldName}`] as any)?.end.type &&
                "Ending number should be larger than starting number"
              }
              label="End"
              description="Ending ID should be greater than the starting ID"
              placeholder="Eg: 329"
            />
          )}
        />
      )}
      {!isRange && (
        <Controller
          control={control}
          name={`${fieldName}.operator`}
          render={({ field: { onChange, onBlur, value } }) => (
            <Select
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              styles={{
                label: {
                  fontSize: "var(--mantine-font-size-xs)",
                  color: "var(--mantine-color-dark-1)",
                },
              }}
              label="Modifier"
              placeholder="Select a modifier"
              data={[
                { value: "eq", label: "Equal" },
                { value: "gt", label: "Greater than" },
                { value: "lt", label: "Less than" },
              ]}
            />
          )}
        />
      )}{" "}
      <Switch
        mt={10}
        label="Range"
        size="sm"
        description="Determines whether filter should be a range"
        checked={isRange}
        onChange={(event) => setIsRange(event.currentTarget.checked)}
      />
    </Stack>
  );
}

type FilterFieldDateProps = {
  fieldName: string;
};
export function FilterFieldDate({ fieldName }: FilterFieldDateProps) {
  const [isRange, setIsRange] = useState(false);
  const {
    control,
    getValues,
    formState: { errors },
  } = useFormContext();

  return (
    <Stack gap={20} mt={10}>
      <Controller
        name={`${fieldName}.start`}
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            styles={{
              label: {
                fontSize: "var(--mantine-font-size-xs)",
                color: "var(--mantine-color-dark-1)",
              },
            }}
            label="Start"
            type="datetime-local"
            placeholder="25-12-2023 12:30"
          />
        )}
      />
      {isRange && (
        <Controller
          name={`${fieldName}.end`}
          rules={{
            validate: {
              largerThanStart: (value) => {
                const startDate = new Date(
                  getValues()[`${fieldName}`].start
                ).getTime();
                const endDate = new Date(value).getTime();
                if (startDate > endDate) {
                  return false;
                }
                return true;
              },
            },
          }}
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              styles={{
                label: {
                  fontSize: "var(--mantine-font-size-xs)",
                  color: "var(--mantine-color-dark-1)",
                },
              }}
              error={
                (errors[`${fieldName}`] as any)?.end.type &&
                "End date should be larger than start date"
              }
              label="End"
              type="datetime-local"
              placeholder="25-12-2023 12:30"
            />
          )}
        />
      )}
      {!isRange && (
        <Controller
          control={control}
          name={`${fieldName}.operator`}
          render={({ field: { onChange, onBlur, value } }) => (
            <Select
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              styles={{
                label: {
                  fontSize: "var(--mantine-font-size-xs)",
                  color: "var(--mantine-color-dark-1)",
                },
              }}
              label="Modifier"
              placeholder="Select a modifier"
              data={[
                { value: "eq", label: "Equal" },
                { value: "gt", label: "Greater than" },
                { value: "lt", label: "Less than" },
              ]}
            />
          )}
        />
      )}
      <Switch
        mt={10}
        label="Range"
        size="sm"
        description="Determines whether filter should be a range"
        checked={isRange}
        onChange={(event) => setIsRange(event.currentTarget.checked)}
      />
    </Stack>
  );
}

type FilterFieldTextProps = {
  fieldName: string;
};
export function FilterFieldText({ fieldName }: FilterFieldTextProps) {
  const { control } = useFormContext();
  return (
    <Stack gap={10} mt={10}>
      <Controller
        name={fieldName}
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            leftSection={<IconSearch stroke={1.5} size={16} />}
            styles={{
              label: {
                fontSize: "var(--mantine-font-size-xs)",
                color: "var(--mantine-color-dark-1)",
              },
            }}
            label="Search"
            description="An exact match will be searched"
            placeholder="Eg: Harry potter"
          />
        )}
      />
    </Stack>
  );
}

type FilterFieldSelectProps = {
  fieldName: string;
  options: Array<{
    value: string;
    label: string;
  }>;
};
export function FilterFieldSelect({
  fieldName,
  options,
}: FilterFieldSelectProps) {
  const { control } = useFormContext();
  return (
    <Controller
      control={control}
      name={fieldName}
      render={({ field: { onChange, onBlur, value } }) => (
        <Select
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          styles={{
            label: {
              fontSize: "var(--mantine-font-size-xs)",
              color: "var(--mantine-color-dark-1)",
            },
          }}
          label="Modifier"
          placeholder="Select a modifier"
          data={options}
        />
      )}
    />
  );
}
