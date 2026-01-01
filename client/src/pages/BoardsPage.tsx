import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import type { Board } from '../types';

export default function BoardsPage() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    try {
      const response = await api.get('/boards');
      setBoards(response.data);
    } catch (error) {
      console.error('Error fetching boards:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">My Boards</h1>
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary-hover transition-colors">
            Create Board
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {boards.map((board) => (
            <Link
              key={board.id}
              to={`/boards/${board.id}`}
              className="block p-6 bg-card rounded-lg border border-border hover:shadow-lg transition-shadow"
            >
              <h2 className="text-2xl font-semibold mb-2">{board.title}</h2>
              <p className="text-muted-foreground">{board.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
