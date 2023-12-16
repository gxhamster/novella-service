import { Path } from "react-hook-form";
import NDrawer from "./NDrawer";
import NDrawerCreateForm from "./NDrawerCreateForm";

export default NDrawer;
export type NDrawerCreateFormFieldsType<TableType> = {
  title: string;
  description?: string;
  fields: Array<{
    field: Path<TableType>;
    title: string;
    help?: string;
    fieldType: "number" | "string" | "date";
    disabled?: boolean;
  }>;
};

export { NDrawerCreateForm };
