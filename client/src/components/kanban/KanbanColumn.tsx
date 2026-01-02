import { useState } from 'react';
import SortableCard from './SortableCard';
import type { Column, Card } from '@/types';
import { IconDots, IconTrash, IconPencil } from '@tabler/icons-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface KanbanColumnProps {
  column: Column;
  onCardClick?: (card: Card) => void;
  onAddCard?: (columnId: number, name: string) => void;
  onUpdateColumn?: (columnId: number, name: string) => void;
  onDeleteColumn?: (columnId: number) => void;
}

export default function KanbanColumn({
  column,
  onCardClick,
  onAddCard,
  onUpdateColumn,
  onDeleteColumn,
}: KanbanColumnProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [columnName, setColumnName] = useState(column.name);
  const [showAddCard, setShowAddCard] = useState(false);
  const [newCardName, setNewCardName] = useState('');

  const handleEditSave = () => {
    if (columnName.trim() && columnName !== column.name) {
      onUpdateColumn?.(column.id, columnName.trim());
    }
    setIsEditing(false);
  };

  const handleAddCard = () => {
    if (newCardName.trim()) {
      onAddCard?.(column.id, newCardName.trim());
      setNewCardName('');
      setShowAddCard(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (isEditing) {
        handleEditSave();
      } else if (showAddCard) {
        handleAddCard();
      }
    } else if (e.key === 'Escape') {
      if (isEditing) {
        setColumnName(column.name);
        setIsEditing(false);
      } else if (showAddCard) {
        setNewCardName('');
        setShowAddCard(false);
      }
    }
  };

  return (
    <div className="min-w-[300px] w-[300px] flex flex-col bg-card rounded-lg border border-border shadow-sm">
      <div className="p-3 border-b border-border">
        <div className="flex items-center justify-between gap-2">
          {isEditing ? (
            <input
              type="text"
              value={columnName}
              onChange={(e) => setColumnName(e.target.value)}
              onBlur={handleEditSave}
              onKeyDown={handleKeyPress}
              autoFocus
              className="flex-1 bg-background border border-border rounded px-2 py-1 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring"
            />
          ) : (
            <div
              className="flex-1 flex items-center gap-2"
              onDoubleClick={() => setIsEditing(true)}
            >
              <h3 className="font-semibold text-base">{column.name}</h3>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                {column.cards?.length || 0}
              </span>
            </div>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="h-8 w-8 flex items-center justify-center rounded hover:bg-muted transition-colors">
                <IconDots className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsEditing(true)}>
                <IconPencil className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDeleteColumn?.(column.id)}
                className="text-destructive"
              >
                <IconTrash className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex-1 p-3 space-y-2 overflow-y-auto min-h-[100px]">
        {column.cards?.map((card) => (
          <SortableCard key={card.id} card={card} onCardClick={onCardClick} />
        ))}
      </div>

      {showAddCard ? (
        <div className="p-3 border-t border-border">
          <input
            type="text"
            placeholder="Enter card title..."
            value={newCardName}
            onChange={(e) => setNewCardName(e.target.value)}
            onBlur={handleAddCard}
            onKeyDown={handleKeyPress}
            autoFocus
            className="w-full bg-background border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      ) : (
        <button
          onClick={() => {
            setShowAddCard(true);
            setTimeout(() => {
              const input = document.querySelector<HTMLInputElement>(
                `input[placeholder="Enter card title..."]`
              );
              input?.focus();
            }, 0);
          }}
          className="p-3 m-3 -mt-2 text-left text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded transition-colors"
        >
          + Add a card
        </button>
      )}
    </div>
  );
}
