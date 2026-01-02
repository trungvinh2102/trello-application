import { Link } from 'react-router-dom';
import type { Board } from '@/types';
import { Button } from '@/components/ui/button';
import { IconPlus, IconSettings, IconUsers } from '@tabler/icons-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface BoardHeaderProps {
  board: Board;
  onAddColumn?: () => void;
}

export default function BoardHeader({ board, onAddColumn }: BoardHeaderProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <Link
            to="/boards"
            className="text-muted-foreground hover:text-foreground text-sm mb-2 inline-block"
          >
            ← Back to boards
          </Link>
          <h1 className="text-3xl font-bold">{board.name}</h1>
          {board.description && <p className="text-muted-foreground mt-1">{board.description}</p>}
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <IconSettings className="h-4 w-4 mr-2" />
                Board Settings
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <IconUsers className="h-4 w-4 mr-2" />
                Manage Members
              </DropdownMenuItem>
              <DropdownMenuItem>Edit Board</DropdownMenuItem>
              <DropdownMenuItem>Change Background</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Delete Board</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button onClick={onAddColumn}>
            <IconPlus className="h-4 w-4 mr-2" />
            Add Column
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            board.visibility === 'public'
              ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
              : board.visibility === 'workspace'
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
          }`}
        >
          {board.visibility}
        </span>
        {board.members && board.members.length > 0 && <span>{board.members.length} members</span>}
      </div>
    </div>
  );
}
