import {
  IconMail,
  IconPlus,
  IconDotsVertical,
  IconMapPin,
  IconCalendar,
} from '@tabler/icons-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Team() {
  const members = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@company.com',
      role: 'Project Manager',
      status: 'Active',
      location: 'San Francisco, CA',
      joinDate: '2022-03-15',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@company.com',
      role: 'Lead Developer',
      status: 'Active',
      location: 'New York, NY',
      joinDate: '2021-08-20',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
    },
    {
      id: 3,
      name: 'Bob Johnson',
      email: 'bob.johnson@company.com',
      role: 'UI/UX Designer',
      status: 'Active',
      location: 'Seattle, WA',
      joinDate: '2023-01-10',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
    },
    {
      id: 4,
      name: 'Alice Williams',
      email: 'alice.williams@company.com',
      role: 'Frontend Developer',
      status: 'On Leave',
      location: 'Austin, TX',
      joinDate: '2022-11-05',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
    },
    {
      id: 5,
      name: 'Charlie Brown',
      email: 'charlie.brown@company.com',
      role: 'Backend Developer',
      status: 'Active',
      location: 'Chicago, IL',
      joinDate: '2023-04-18',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie',
    },
    {
      id: 6,
      name: 'Diana Prince',
      email: 'diana.prince@company.com',
      role: 'QA Engineer',
      status: 'Active',
      location: 'Denver, CO',
      joinDate: '2022-07-22',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Diana',
    },
    {
      id: 7,
      name: 'Michael Scott',
      email: 'michael.scott@company.com',
      role: 'Sales Manager',
      status: 'Active',
      location: 'Boston, MA',
      joinDate: '2021-05-30',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    },
    {
      id: 8,
      name: 'Emily Chen',
      email: 'emily.chen@company.com',
      role: 'Data Analyst',
      status: 'Active',
      location: 'Los Angeles, CA',
      joinDate: '2023-02-14',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
    },
    {
      id: 9,
      name: 'David Miller',
      email: 'david.miller@company.com',
      role: 'DevOps Engineer',
      status: 'Inactive',
      location: 'Portland, OR',
      joinDate: '2022-09-08',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    },
    {
      id: 10,
      name: 'Sarah Wilson',
      email: 'sarah.wilson@company.com',
      role: 'Product Designer',
      status: 'Active',
      location: 'Miami, FL',
      joinDate: '2023-06-01',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'default';
      case 'On Leave':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'Active':
        return 'Active';
      case 'On Leave':
        return 'On Leave';
      case 'Inactive':
        return 'Inactive';
      default:
        return status;
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="flex items-center justify-between px-4 lg:px-6">
        <h1 className="text-3xl font-bold">Team</h1>
        <Button>
          <IconPlus className="h-4 w-4 mr-2" />
          Add Member
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4 lg:px-6">
        {members.map((member) => (
          <Card key={member.id}>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback>
                    {member.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <CardDescription className="text-sm">{member.role}</CardDescription>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <IconDotsVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>View Profile</DropdownMenuItem>
                  <DropdownMenuItem>Edit Member</DropdownMenuItem>
                  <DropdownMenuItem>Send Message</DropdownMenuItem>
                  <DropdownMenuItem>Remove Member</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <IconMail className="h-4 w-4" />
                <span className="truncate">{member.email}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <IconMapPin className="h-4 w-4" />
                <span className="truncate">{member.location}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <IconCalendar className="h-4 w-4" />
                <span>Joined {new Date(member.joinDate).toLocaleDateString()}</span>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <Badge variant={getStatusColor(member.status)}>
                  {getStatusText(member.status)}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
