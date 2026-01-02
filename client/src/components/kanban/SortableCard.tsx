import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import CardItem from './CardItem';
import type { Card } from '@/types';

interface SortableCardProps {
  card: Card;
  onCardClick?: (card: Card) => void;
}

export default function SortableCard({ card, onCardClick }: SortableCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <CardItem card={card} onClick={() => onCardClick?.(card)} />
    </div>
  );
}
