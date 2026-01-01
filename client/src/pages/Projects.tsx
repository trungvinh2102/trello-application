import {
  IconFolder,
  IconPlus,
  IconClock,
  IconCheck,
  IconProgress,
  IconDotsVertical,
  IconAlertCircle,
} from '@tabler/icons-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Projects() {
  const projects = [
    {
      id: 1,
      name: 'Website Redesign',
      description: 'Complete overhaul of company website with modern UI',
      status: 'In Progress',
      progress: 65,
      team: 5,
      dueDate: '2025-02-15',
      priority: 'High',
    },
    {
      id: 2,
      name: 'Mobile App Development',
      description: 'Native iOS and Android application',
      status: 'In Progress',
      progress: 45,
      team: 8,
      dueDate: '2025-03-01',
      priority: 'High',
    },
    {
      id: 3,
      name: 'Database Migration',
      description: 'Migrate to PostgreSQL cloud database',
      status: 'Completed',
      progress: 100,
      team: 3,
      dueDate: '2024-12-30',
      priority: 'Medium',
    },
    {
      id: 4,
      name: 'API Integration',
      description: 'Integrate third-party payment APIs',
      status: 'In Progress',
      progress: 72,
      team: 4,
      dueDate: '2025-01-20',
      priority: 'High',
    },
    {
      id: 5,
      name: 'Security Audit',
      description: 'Comprehensive security review and penetration testing',
      status: 'Planning',
      progress: 10,
      team: 2,
      dueDate: '2025-02-28',
      priority: 'Critical',
    },
    {
      id: 6,
      name: 'Performance Optimization',
      description: 'Improve application performance and load times',
      status: 'In Progress',
      progress: 88,
      team: 3,
      dueDate: '2025-01-15',
      priority: 'Medium',
    },
    {
      id: 7,
      name: 'User Analytics Dashboard',
      description: 'Build real-time analytics dashboard for users',
      status: 'Planning',
      progress: 5,
      team: 4,
      dueDate: '2025-03-15',
      priority: 'Low',
    },
    {
      id: 8,
      name: 'Email Campaign System',
      description: 'Automated email marketing platform',
      status: 'In Progress',
      progress: 35,
      team: 3,
      dueDate: '2025-02-20',
      priority: 'Medium',
    },
    {
      id: 9,
      name: 'Multi-language Support',
      description: 'Add i18n support for 10+ languages',
      status: 'Planning',
      progress: 0,
      team: 2,
      dueDate: '2025-04-01',
      priority: 'Low',
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <IconCheck className="h-4 w-4 text-green-500" />;
      case 'In Progress':
        return <IconProgress className="h-4 w-4 text-blue-500" />;
      default:
        return <IconClock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'default';
      case 'In Progress':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return 'text-red-500 bg-red-500/10';
      case 'High':
        return 'text-orange-500 bg-orange-500/10';
      case 'Medium':
        return 'text-blue-500 bg-blue-500/10';
      default:
        return 'text-gray-500 bg-gray-500/10';
    }
  };

  const getPriorityIcon = (priority: string) => {
    return priority === 'Critical' ? <IconAlertCircle className="h-3 w-3" /> : null;
  };

  return (
    <div className="flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="flex items-center justify-between px-4 lg:px-6">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Button>
          <IconPlus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4 lg:px-6">
        {projects.map((project) => (
          <Card key={project.id}>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  <Badge
                    variant="outline"
                    className={`text-xs ${getPriorityColor(project.priority)}`}
                  >
                    {getPriorityIcon(project.priority)}
                    {project.priority}
                  </Badge>
                </div>
                <CardDescription className="text-sm">{project.description}</CardDescription>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <IconDotsVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>View Details</DropdownMenuItem>
                  <DropdownMenuItem>Edit Project</DropdownMenuItem>
                  <DropdownMenuItem>Archive</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant={getStatusBadgeVariant(project.status)} className="gap-1">
                  {getStatusIcon(project.status)}
                  {project.status}
                </Badge>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <IconClock className="h-4 w-4" />
                  {project.dueDate}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm text-muted-foreground">{project.progress}%</span>
                </div>
                <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-primary h-full transition-all"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <IconFolder className="h-4 w-4" />
                  {project.team} team members
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
