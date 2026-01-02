import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Column } from '../types';

interface SortableColumnProps {
  column: Column;
}

export default function SortableColumn({ column }: SortableColumnProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: column.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="min-w-75 bg-card rounded-lg p-4 border border-border shadow-sm"
    >
      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
        <span className="text-muted-foreground">≡</span>
        {column.name}
        <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
          {column.cards?.length || 0}
        </span>
      </h3>
      <div className="space-y-2">
        {column.cards?.map((card) => (
          <div
            key={card.id}
            className="bg-background p-3 rounded border border-border hover:shadow-md transition-shadow cursor-pointer"
          >
            <h4 className="font-medium">{card.name}</h4>
            {card.description && (
              <p className="text-sm text-muted-foreground mt-1">{card.description}</p>
            )}
          </div>
        ))}
      </div>
      <button className="w-full mt-4 text-left text-sm text-muted-foreground hover:text-foreground">
        + Add Card
      </button>
    </div>
  );
}
