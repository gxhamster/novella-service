import { Database } from "./types";

export type IBook = Database["public"]["Tables"]["books"]["Row"];
export type IBookInsert = Database["public"]["Tables"]["books"]["Insert"];
export type IBookUpdate = Database["public"]["Tables"]["books"]["Update"];

export type IStudent = Database["public"]["Tables"]["students"]["Row"];
export type IStudentInsert = Database["public"]["Tables"]["students"]["Insert"];
export type IStudentUpdate = Database["public"]["Tables"]["students"]["Update"];

export type IIssuedBook = Database["public"]["Tables"]["issued"]["Row"];
export type IIssuedBookInsert =
  Database["public"]["Tables"]["issued"]["Insert"];
export type IIssuedBookUpdate =
  Database["public"]["Tables"]["issued"]["Update"];

export type IHistory = Database["public"]["Tables"]["history"]["Row"];
export type IHistoryInsert = Database["public"]["Tables"]["history"]["Insert"];
export type IHistoryUpdate = Database["public"]["Tables"]["history"]["Update"];

export type ITables = keyof Database["public"]["Tables"];
