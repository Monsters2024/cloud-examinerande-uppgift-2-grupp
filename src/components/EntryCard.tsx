import { Entry } from "@/types/database.types";
import DeleteButton from "./DeleteButton";
import EditButton from "./EditButton";

interface EntryCardProps {
  entry: Entry;
}

export default function EntryCard({ entry }: EntryCardProps) {
  const formattedDate = new Date(entry.created_at).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="card" style={{ minWidth: "600px" }}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="mb-4">
            <div className="text-xs text-warm-gray mb-2 tracking-wide uppercase">
              {formattedDate}
            </div>
            <h2 className="text-2xl font-serif text-dark-brown mb-3">
              {entry.title}
            </h2>
          </div>
          <p
            className="text-dark-brown/80 leading-relaxed whitespace-pre-wrap"
            style={{ width: "550px" }}>
            {entry.content}
          </p>
        </div>
        <div className="ml-4 flex flex-col gap-2">
          <EditButton
            id={entry.id}
            className="text-sm px-3 py-1 btn-secondary"
          />
          <DeleteButton
            className="text-sm px-3 py-1 btn-primary"
            id={entry.id}
          />
        </div>
      </div>
    </div>
  );
}
