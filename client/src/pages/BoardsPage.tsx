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

export default function BoardsPage() {
  const boards = [
    {
      id: 1,
      title: 'Product Roadmap',
      description: 'Track product development milestones and features',
      color: 'bg-blue-500',
      taskCount: 24,
      memberCount: 8,
    },
    {
      id: 2,
      title: 'Marketing Campaign',
      description: 'Plan and execute Q1 marketing initiatives',
      color: 'bg-green-500',
      taskCount: 15,
      memberCount: 5,
    },
    {
      id: 3,
      title: 'Sprint Backlog',
      description: 'Current sprint tasks and deliverables',
      color: 'bg-purple-500',
      taskCount: 32,
      memberCount: 6,
    },
    {
      id: 4,
      title: 'Design System',
      description: 'UI components and design guidelines',
      color: 'bg-pink-500',
      taskCount: 18,
      memberCount: 4,
    },
    {
      id: 5,
      title: 'Bug Tracking',
      description: 'Report and track software issues',
      color: 'bg-red-500',
      taskCount: 45,
      memberCount: 3,
    },
    {
      id: 6,
      title: 'User Research',
      description: 'Customer feedback and insights',
      color: 'bg-yellow-500',
      taskCount: 12,
      memberCount: 2,
    },
  ];

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
                    {board.title}
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
                    <div className={`h-2 w-2 rounded-full ${board.color}`} />
                    <span>{board.taskCount} tasks</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>👥</span>
                    <span>{board.memberCount} members</span>
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
