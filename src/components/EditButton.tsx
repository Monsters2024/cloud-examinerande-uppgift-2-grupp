"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface EditButtonProps {
  id: string;
  className?: string;
  label?: string;
}

export default function EditButton({
  id,
  className,
  label = "Edit entry",
}: EditButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleEdit = () => {
    setLoading(true);
    try {
      // Navigate to the edit page for this entry
      router.push(`/dashboard/${id}/edit`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className={className ?? "btn-secondary"}
      onClick={handleEdit}
      disabled={loading}>
      {loading ? "Opening..." : label}
    </button>
  );
}
