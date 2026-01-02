import type { Card } from '@/types';

interface CardItemProps {
  card: Card;
  onClick?: () => void;
}

export default function CardItem({ card, onClick }: CardItemProps) {
  const isOverdue = card.due_date && !card.completed && new Date(card.due_date) < new Date();

  return (
    <div
      onClick={onClick}
      className={`
        bg-background p-3 rounded border border-border 
        hover:shadow-md transition-shadow cursor-pointer
        ${isOverdue ? 'border-l-4 border-l-red-500' : ''}
      `}
    >
      <h4 className="font-medium text-sm mb-1">{card.name}</h4>
      {card.description && (
        <p className="text-xs text-muted-foreground line-clamp-2">{card.description}</p>
      )}
      {card.due_date && (
        <div
          className={`text-xs mt-2 ${isOverdue ? 'text-red-500 font-medium' : 'text-muted-foreground'}`}
        >
          {new Date(card.due_date).toLocaleDateString()}
        </div>
      )}
    </div>
  );
}
