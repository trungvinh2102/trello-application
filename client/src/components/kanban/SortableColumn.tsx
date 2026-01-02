import { useDroppable } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import KanbanColumn from './KanbanColumn';
import type { Column, Card } from '@/types';

interface SortableColumnProps {
  column: Column;
  onCardClick?: (card: Card) => void;
  onAddCard?: (columnId: number, name: string) => void;
  onUpdateColumn?: (columnId: number, name: string) => void;
  onDeleteColumn?: (columnId: number) => void;
}

export default function SortableColumn({
  column,
  onCardClick,
  onAddCard,
  onUpdateColumn,
  onDeleteColumn,
}: SortableColumnProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: column.id,
  });
  const { setNodeRef: setDroppableRef } = useDroppable({
    id: column.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div ref={setDroppableRef} {...attributes} {...listeners}>
        <KanbanColumn
          column={column}
          onCardClick={onCardClick}
          onAddCard={onAddCard}
          onUpdateColumn={onUpdateColumn}
          onDeleteColumn={onDeleteColumn}
        />
      </div>
    </div>
  );
}
