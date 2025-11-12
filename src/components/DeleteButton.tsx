"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteEntry } from "@/lib/supabase/queries";

interface DeleteButtonProps {
  id: string;
  onDeleted?: () => void;
  className?: string;
  confirmMessage?: string;
}

export default function DeleteButton({ id, onDeleted, className, confirmMessage = "Are you sure you want to delete this entry?" }: DeleteButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(confirmMessage)) return;
    setError(null);
    setLoading(true);
    try {
      await deleteEntry(id);
      if (onDeleted) {
        onDeleted();
           
         
      } else {
        router.refresh();
      }
       window.location.reload();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to delete entry");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button className={className ?? "btn-primary"} onClick={handleDelete} disabled={loading}>
        {loading ? "Deleting..." : "Delete entry"}
      </button>
      {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
    </>
  );
}