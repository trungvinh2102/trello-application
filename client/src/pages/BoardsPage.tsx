import { useEffect, useState } from 'react';
import { IconPlus } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { IconDotsVertical } from '@tabler/icons-react';
import { boardService } from '@/services';
import type { Board } from '@/types';

export default function BoardsPage() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const data = await boardService.getAllBoards();
        setBoards(data);
      } catch (error) {
        console.error('Failed to fetch boards:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBoards();
  }, []);

  const getBoardColor = (board: Board) => {
    if (board.background_color) {
      return board.background_color;
    }
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-red-500',
      'bg-yellow-500',
    ];
    return colors[board.id % colors.length];
  };

  const getTaskCount = (board: Board) => {
    return board.columns?.reduce((acc, col) => acc + (col.cards?.length || 0), 0) || 0;
  };

  const getMemberCount = (board: Board) => {
    return board.members?.length || 0;
  };

  if (loading) {
    return (
      <div className="flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="flex items-center justify-between px-4 lg:px-6">
          <h1 className="text-3xl font-bold">Boards</h1>
        </div>
        <div className="px-4 lg:px-6">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="flex items-center justify-between px-4 lg:px-6">
        <h1 className="text-3xl font-bold">Boards</h1>
        <Button>
          <IconPlus className="h-4 w-4 mr-2" />
          Create Board
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4 lg:px-6">
        {boards.map((board) => (
          <Card key={board.id} className="group hover:shadow-lg transition-shadow">
            <Link to={`/boards/${board.id}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {board.name}
                  </CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <IconDotsVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit Board</DropdownMenuItem>
                      <DropdownMenuItem>Duplicate</DropdownMenuItem>
                      <DropdownMenuItem>Archive</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardDescription>{board.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <div className={`h-2 w-2 rounded-full ${getBoardColor(board)}`} />
                    <span>{getTaskCount(board)} tasks</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>👥</span>
                    <span>{getMemberCount(board)} members</span>
                  </div>
                </div>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
