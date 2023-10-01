import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/supabase/types/supabase";
import { NextResponse } from "next/server";
import { ITables } from "@/supabase/types/supabase";

const supabase = createRouteHandlerClient<Database>({ cookies });
const table: ITables = "students";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const { data, error } = await supabase
    .from(table)
    .select("*")
    .eq("id", Number(searchParams.get("id")));

  const resultStudent = data ? data[0] : null;

  return NextResponse.json({ data: resultStudent || {}, error });
}

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const jsonData = await request.json();

  const { data: updatedStudent, error } = await supabase
    .from(table)
    .update(jsonData)
    .eq("id", Number(searchParams.get("id")))
    .select();

  return NextResponse.json({ data: updatedStudent || {}, error });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const { ids } = await request.json();

  if (ids) {
    const { error } = await supabase.from(table).delete().in("id", ids);
    return NextResponse.json({ error });
  }

  const { error } = await supabase
    .from(table)
    .delete()
    .eq("id", Number(searchParams.get("id")));

  return NextResponse.json({ error });
}

export async function POST(request: Request) {
  const reqBody = await request.json();

  const { data, error } = await supabase.from(table).insert(reqBody).select();

  return NextResponse.json({ error, data });
}
