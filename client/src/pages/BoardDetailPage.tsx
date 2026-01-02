import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import type { Board, Card } from '@/types';
import { boardService, columnService, cardService } from '@/services';
import BoardHeader from '@/components/kanban/BoardHeader';
import SortableColumn from '@/components/kanban/SortableColumn';
import AddColumnDialog from '@/components/kanban/AddColumnDialog';
import ConfirmDeleteDialog from '@/components/kanban/ConfirmDeleteDialog';
import { toast } from 'sonner';

export default function BoardDetailPage() {
  const { id } = useParams();
  const [board, setBoard] = useState<Board | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddColumnDialog, setShowAddColumnDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{
    show: boolean;
    type: 'column' | 'card';
    id: number;
  }>({
    show: false,
    type: 'column',
    id: 0,
  });
  const [activeCard, setActiveCard] = useState<Card | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const fetchBoard = useCallback(async () => {
    try {
      setLoading(true);
      const data = (await boardService.getBoard(id!, true)) as unknown as Board;
      setBoard(data);
    } catch (error) {
      console.error('Error fetching board:', error);
      toast.error('Failed to load board');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchBoard();
  }, [fetchBoard]);

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const { active } = event;
      const card = board?.columns
        ?.flatMap((col) => col.cards || [])
        .find((c) => c.id === active.id);
      if (card) {
        setActiveCard(card);
      }
    },
    [board]
  );

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveCard(null);

      if (!over || !board) return;

      const activeCard = board.columns
        ?.flatMap((col) => col.cards || [])
        .find((c) => c.id === active.id);

      const activeCardColumn = board.columns?.find((col) =>
        col.cards?.some((c) => c.id === active.id)
      );

      if (!activeCard || !activeCardColumn) return;

      console.log('DragEnd:', { activeId: active.id, overId: over.id, activeCard });

      const overId = typeof over.id === 'string' ? parseInt(over.id, 10) : over.id;
      let overColumn = board.columns?.find((col) => col.id === overId);

      let overCard: Card | undefined;
      if (!overColumn) {
        overCard = board.columns?.flatMap((col) => col.cards || []).find((c) => c.id === overId);
        overColumn = board.columns?.find((col) => col.cards?.some((c) => c.id === overId));
      }

      console.log('Over detection:', { overColumn, overCard });

      if (!overColumn) return;

      const isSameColumn = activeCardColumn.id === overColumn.id;
      const activeCards = activeCardColumn.cards || [];
      const targetCards = overColumn.cards || [];

      console.log('Move info:', { isSameColumn, activeCardColumn, overColumn, targetCards });

      if (isSameColumn) {
        const oldIndex = activeCards.findIndex((c) => c.id === activeCard.id);

        if (oldIndex === -1) return;

        let newIndex: number;

        if (overCard) {
          newIndex = targetCards.findIndex((c) => c.id === overCard.id);
        } else {
          newIndex = targetCards.length;
        }

        if (newIndex !== oldIndex) {
          const reorderedCards = arrayMove(activeCards, oldIndex, newIndex);

          const updatedColumns = board.columns?.map((col) =>
            col.id === activeCardColumn.id ? { ...col, cards: reorderedCards } : col
          );

          setBoard({ ...board, columns: updatedColumns });

          try {
            await cardService.moveCard(String(activeCard.id), {
              target_column_id: activeCardColumn.id,
              position: newIndex,
            });
          } catch (error) {
            console.error('Error moving card:', error);
            toast.error('Failed to move card');
            fetchBoard();
          }
        }
      } else {
        console.log('Moving between columns');
        const sourceColumnId = activeCardColumn.id;
        const targetColumnId = overColumn.id;

        let newPosition: number;

        if (overCard) {
          newPosition = targetCards.findIndex((c) => c.id === overCard.id);
        } else {
          newPosition = targetCards.length;
        }

        console.log('New position:', newPosition);

        const updatedColumns = board.columns?.map((col) => {
          if (col.id === sourceColumnId) {
            return {
              ...col,
              cards: activeCards.filter((c) => c.id !== activeCard.id),
            };
          } else if (col.id === targetColumnId) {
            const newCards = [...(col.cards || [])];
            newCards.splice(newPosition, 0, activeCard);
            return {
              ...col,
              cards: newCards,
            };
          }
          return col;
        });

        setBoard({ ...board, columns: updatedColumns });

        try {
          console.log('Calling API to move card:', {
            cardId: activeCard.id,
            target_column_id: targetColumnId,
            position: newPosition,
          });
          await cardService.moveCard(String(activeCard.id), {
            target_column_id: targetColumnId,
            position: newPosition,
          });
          console.log('API call successful');
        } catch (error) {
          console.error('Error moving card between columns:', error);
          toast.error('Failed to move card');
          fetchBoard();
        }
      }
    },
    [board, fetchBoard]
  );

  const handleAddColumn = async (name: string) => {
    try {
      await columnService.createColumn(id!, { name });
      toast.success('Column created successfully');
      fetchBoard();
    } catch (error) {
      console.error('Error adding column:', error);
      toast.error('Failed to add column');
    }
  };

  const handleUpdateColumn = async (columnId: number, name: string) => {
    try {
      await columnService.updateColumn(String(columnId), { name });
      toast.success('Column updated successfully');
      fetchBoard();
    } catch (error) {
      console.error('Error updating column:', error);
      toast.error('Failed to update column');
    }
  };

  const handleDeleteColumn = async (columnId: number) => {
    try {
      await columnService.deleteColumn(String(columnId));
      toast.success('Column deleted successfully');
      fetchBoard();
    } catch (error) {
      console.error('Error deleting column:', error);
      toast.error('Failed to delete column');
    }
  };

  const handleAddCard = async (columnId: number, name: string) => {
    try {
      await cardService.createCard(String(columnId), { name });
      toast.success('Card created successfully');
      fetchBoard();
    } catch (error) {
      console.error('Error adding card:', error);
      toast.error('Failed to add card');
    }
  };

  const handleCardClick = (card: Card) => {
    console.log('Card clicked:', card);
  };

  const confirmDelete = async () => {
    if (deleteDialog.type === 'column') {
      await handleDeleteColumn(deleteDialog.id);
    } else {
      try {
        await cardService.deleteCard(String(deleteDialog.id));
        toast.success('Card deleted successfully');
        fetchBoard();
      } catch (error) {
        console.error('Error deleting card:', error);
        toast.error('Failed to delete card');
      }
    }
    setDeleteDialog({ show: false, type: 'column', id: 0 });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="flex flex-col gap-4 mx-auto">
          <div className="h-12 w-64 bg-muted rounded animate-pulse" />
          <div className="flex gap-4 overflow-x-auto pb-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="min-w-75 h-96 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!board) {
    return (
      <div className="flex justify-center items-center h-screen bg-background">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Board Not Found</h2>
          <p className="text-muted-foreground">The board you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto">
        <BoardHeader board={board} onAddColumn={() => setShowAddColumnDialog(true)} />

        {board.columns && board.columns.length > 0 ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <DragOverlay>
              {activeCard && (
                <div className="min-w-75 w-75 bg-background p-3 rounded border border-border shadow-lg rotate-3 opacity-90">
                  <h4 className="font-medium text-sm">{activeCard.name}</h4>
                  {activeCard.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {activeCard.description}
                    </p>
                  )}
                </div>
              )}
            </DragOverlay>

            <SortableContext
              items={board.columns.map((col) => col.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="flex gap-4 overflow-x-auto pb-4">
                {board.columns.map((column) => (
                  <SortableColumn
                    key={column.id}
                    column={column}
                    onCardClick={handleCardClick}
                    onAddCard={handleAddCard}
                    onUpdateColumn={handleUpdateColumn}
                    onDeleteColumn={(id) => setDeleteDialog({ show: true, type: 'column', id })}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-xl font-semibold mb-2">No columns yet</h3>
            <p className="text-muted-foreground mb-6">Create your first column to get started</p>
            <button
              onClick={() => setShowAddColumnDialog(true)}
              className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Add First Column
            </button>
          </div>
        )}
      </div>

      <AddColumnDialog
        open={showAddColumnDialog}
        onOpenChange={setShowAddColumnDialog}
        onSubmit={handleAddColumn}
      />

      <ConfirmDeleteDialog
        open={deleteDialog.show}
        onOpenChange={(show) => setDeleteDialog((prev) => ({ ...prev, show }))}
        onConfirm={confirmDelete}
        title={`Delete ${deleteDialog.type === 'column' ? 'Column' : 'Card'}`}
        description={`Are you sure you want to delete this ${
          deleteDialog.type === 'column' ? 'column' : 'card'
        }? All cards in column will also be deleted.`}
      />
    </div>
  );
}
