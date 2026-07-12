import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";

const waitlistSchema = z.object({
  email: z.string().email(),
  role: z.enum(["recruiter", "candidate"]),
  name: z.string().min(1).max(120).optional(),
});

// In-memory fallback so the waitlist still works end-to-end during a demo
// without Supabase configured. Not persisted across server restarts.
const memoryStore = new Set<string>();

export async function POST(req: NextRequest) {
  const parsed = waitlistSchema.safeParse(await req.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json({ error: "Please provide a valid email and role." }, { status: 400 });
  }

  const { email, role, name } = parsed.data;
  const normalizedEmail = email.trim().toLowerCase();

  const supabase = getSupabaseServerClient();

  if (supabase) {
    const { data: existing } = await supabase
      .from("waitlist")
      .select("id")
      .eq("email", normalizedEmail)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ error: "That email is already on the waitlist." }, { status: 409 });
    }

    const { error } = await supabase.from("waitlist").insert([
      {
        email: normalizedEmail,
        role,
        name: name ?? null,
      },
    ]);

    if (error) {
      return NextResponse.json({ error: "Could not join the waitlist. Please try again." }, { status: 500 });
    }

    return NextResponse.json({ success: true, storage: "supabase" });
  }

  if (memoryStore.has(normalizedEmail)) {
    return NextResponse.json({ error: "That email is already on the waitlist." }, { status: 409 });
  }
  memoryStore.add(normalizedEmail);

  return NextResponse.json({
    success: true,
    storage: "memory",
    note: isSupabaseConfigured() ? undefined : "SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not set — using in-memory fallback.",
  });
}
