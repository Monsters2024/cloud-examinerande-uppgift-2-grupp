import { supabase } from "./client";
import { Entry, NewEntry } from "@/types/database.types";

/**
 * Fetch all entries for the authenticated user
 */
export async function getEntries(): Promise<Entry[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("entries")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data || [];
}

/**
 * Get a single entry by ID (returns null if not found)
 */
export async function getEntryById(id: string): Promise<Entry | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("entries")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();
  if (error) throw error;
  return (data as Entry) ?? null;
}

/**
 * Create a new entry for the authenticated user
 */
export async function createEntry(entry: NewEntry): Promise<Entry> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const title = entry.title?.trim();
  const content = entry.content?.trim();
  if (!title || !content) throw new Error("Title and content are required");

  const { data, error } = await supabase
    .from("entries")
    .insert([
      {
        user_id: user.id,
        title,
        content,
        created_at: new Date().toISOString(),
      },
    ])
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data as Entry;
}

/**
 * Update an entry (title/content) owned by the current user
 */
export async function updateEntry(
  id: string,
  patch: Partial<Pick<Entry, "title" | "content">>
): Promise<Entry> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  // Build update payload, skipping undefined
  const updates: Record<string, unknown> = {};
  if (typeof patch.title === "string") updates.title = patch.title.trim();
  if (typeof patch.content === "string") updates.content = patch.content.trim();

  if (Object.keys(updates).length === 0) {
    throw new Error("Nothing to update");
  }

  const { data, error } = await supabase
    .from("entries")
    .update(updates)
    .eq("id", id)
    .eq("user_id", user.id)
    .select("*")
    .single();

  if (error) throw error;
  return data as Entry;
}

/**
 * Delete an entry by ID
 */
export async function deleteEntry(id: string) {
  const { data, error } = await supabase.from("entries").delete().eq("id", id);

  if (error) throw error;
  return data;
}
