import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/supabase";
import { NextResponse } from "next/server";

const supabase = createRouteHandlerClient<Database>({ cookies });

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const { data, error } = await supabase
    .from("students")
    .select("*")
    .eq("id", Number(searchParams.get("id")));

  const resultStudent = data ? data[0] : null;

  return NextResponse.json({ data: resultStudent || {}, error });
}

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const jsonData = await request.json();

  const { data: updatedStudent, error } = await supabase
    .from("students")
    .update(jsonData)
    .eq("id", Number(searchParams.get("id")))
    .select();

  return NextResponse.json({ data: updatedStudent || {}, error });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);

  const { error } = await supabase
    .from("students")
    .delete()
    .eq("id", Number(searchParams.get("id")));

  return NextResponse.json({ error });
}

export async function POST(request: Request) {
  const reqBody = await request.json();

  const { data, error } = await supabase
    .from("students")
    .insert(reqBody)
    .select();

  return NextResponse.json({ error, data });
}
