import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { Database, ITables } from "@/supabase/types/supabase";
import { NextResponse } from "next/server";

const supabase = createRouteHandlerClient<Database>({ cookies });
const table: ITables = "history";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const { data, error } = await supabase
    .from(table)
    .select("*, book_id, books (id, title), student_id, students (id, name)")
    .eq("id", Number(searchParams.get("id")));

  const resultBook = data ? data[0] : null;

  return NextResponse.json({ data: resultBook || {}, error });
}

export async function POST(request: Request) {
  const reqBody = await request.json();
  console.table(reqBody);
  const { data, error } = await supabase.from(table).insert(reqBody).select();

  return NextResponse.json({ error, data });
}
