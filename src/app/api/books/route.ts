import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/supabase";
import { NextResponse } from "next/server";

const supabase = createRouteHandlerClient<Database>({ cookies });

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const { data, error } = await supabase
    .from("books")
    .select("*")
    .eq("id", Number(searchParams.get("id")));

  const resultBook = data ? data[0] : null;

  return NextResponse.json({ data: resultBook || {}, error });
}

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const jsonData = await request.json();

  const { data: updatedBook, error } = await supabase
    .from("books")
    .update(jsonData)
    .eq("id", Number(searchParams.get("id")))
    .select();

  return NextResponse.json({ data: updatedBook || {}, error });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);

  const { error } = await supabase
    .from("books")
    .delete()
    .eq("id", Number(searchParams.get("id")));

  return NextResponse.json({ error });
}
