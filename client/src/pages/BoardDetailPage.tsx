import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import type { Board } from '../types';
import SortableColumn from '../components/SortableColumn';

export default function BoardDetailPage() {
  const { id } = useParams();
  const [board, setBoard] = useState<Board | null>(null);
  const [loading, setLoading] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchBoard();
  }, [id]);

  const fetchBoard = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/boards/${id}`);
      const data = await response.json();
      setBoard(data);
    } catch (error) {
      console.error('Error fetching board:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || !board) return;

    if (active.id !== over.id) {
      const columns = [...(board.columns || [])];
      const oldIndex = columns.findIndex((col) => col.id === active.id);
      const newIndex = columns.findIndex((col) => col.id === over.id);

      setBoard({
        ...board,
        columns: arrayMove(columns, oldIndex, newIndex),
      });
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!board) {
    return <div className="flex justify-center items-center h-screen">Board not found</div>;
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link to="/" className="text-muted-foreground hover:text-foreground mb-2 inline-block">
              ← Back to boards
            </Link>
            <h1 className="text-4xl font-bold">{board.title}</h1>
          </div>
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary-hover transition-colors">
            Add Column
          </button>
        </div>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext
            items={board.columns?.map((col) => col.id) || []}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex gap-4 overflow-x-auto pb-4">
              {board.columns?.map((column) => (
                <SortableColumn key={column.id} column={column} />
              ))}
              <div className="min-w-75 bg-muted/30 rounded-lg p-4 border-2 border-dashed border-border">
                <button className="w-full text-left text-muted-foreground hover:text-foreground">
                  + Add Column
                </button>
              </div>
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}
