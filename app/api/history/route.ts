
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      { error: "Please sign in." },
      { status: 401 }
    );
  }

  const { data, error } = await supabase
    .from("generations")
    .select("id, content_type, tone, topic, output, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load history:", error);
    return NextResponse.json(
      { error: "Could not load generation history." },
      { status: 500 }
    );
  }

  return NextResponse.json({ generations: data });
}
