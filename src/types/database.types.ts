export interface Entry {
  id: string;
  user_id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at?: string | null;
  tags: string[];
}

export interface NewEntry {
  title: string;
  content: string;
  tags?: string[];
}
