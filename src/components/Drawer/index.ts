import { Path } from "react-hook-form";
import DrawerCreateForm from "./DrawerCreateForm";

export type DrawerCreateFormFieldsType<TableType> = {
  title: string;
  description?: string;
  fields: Array<{
    field: Path<TableType>;
    title: string;
    help?: string;
    fieldType: "number" | "string" | "date";
    required?: boolean;
    disabled?: boolean;
  }>;
};

export { DrawerCreateForm };
