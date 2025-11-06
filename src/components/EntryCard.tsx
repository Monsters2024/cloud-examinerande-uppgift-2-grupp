import { Entry } from '@/types/database.types'
import DeleteButton from './DeleteButton';

interface EntryCardProps {
  entry: Entry
}

export default function EntryCard({ entry }: EntryCardProps) {
  const formattedDate = new Date(entry.created_at).toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});

  return (
    <div className="card w-full">
      <div className="flex flex-col md:flex-row md:justify-between items-start">
        <div className="flex-1 mb-4 md:mb-0 md:mr-4">
          <div className="mb-4">
            <div className="text-xs text-warm-gray mb-2 tracking-wide uppercase">
              {formattedDate}
            </div>
            <h2 className="text-2xl font-serif text-dark-brown mb-3 break-all">{entry.title}</h2>
          </div>
          <p className="text-dark-brown/80 leading-relaxed whitespace-pre-wrap break-words">
            {entry.content}
          </p>
        </div>
        <div className="self-start mt-2 md:mt-0">
          <DeleteButton className='text-sm px-3 py-1 btn-primary' id={entry.id} />
        </div>
      </div>
    </div>
  )
}
