import { createClient } from "@supabase/supabase-js";

interface Database {
  public: {
    Tables: {
      waitlist: {
        Row: {
          id: string;
          email: string;
          role: "recruiter" | "candidate";
          name: string | null;
          created_at: string;
        };
        Insert: {
          email: string;
          role: "recruiter" | "candidate";
          name?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["waitlist"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

let cached: ReturnType<typeof createClient<Database>> | null = null;

export function isSupabaseConfigured(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

/** Server-only Supabase client using the service role key. Never import this in client components. */
export function getSupabaseServerClient() {
  if (!isSupabaseConfigured()) return null;
  if (cached) return cached;

  cached = createClient<Database>(
    process.env.SUPABASE_URL as string,
    process.env.SUPABASE_SERVICE_ROLE_KEY as string,
    { auth: { persistSession: false } }
  );

  return cached;
}
