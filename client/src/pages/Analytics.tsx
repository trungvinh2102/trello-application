import {
  IconTrendingUp,
  IconUsers,
  IconEye,
  IconChartBar,
  IconClock,
  IconFileText,
  IconCheck,
} from '@tabler/icons-react';

import { Card, CardHeader, CardDescription, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function Analytics() {
  const stats = [
    {
      title: 'Total Views',
      value: '125,643',
      change: '+15.3%',
      trend: 'up',
      icon: IconEye,
    },
    {
      title: 'Active Users',
      value: '12,847',
      change: '+8.7%',
      trend: 'up',
      icon: IconUsers,
    },
    {
      title: 'Conversion Rate',
      value: '3.2%',
      change: '+0.5%',
      trend: 'up',
      icon: IconChartBar,
    },
    {
      title: 'Revenue Growth',
      value: '$45,280',
      change: '+23.1%',
      trend: 'up',
      icon: IconTrendingUp,
    },
  ];

  const topPages = [
    { page: '/boards', views: '45,230', bounce: '32%' },
    { page: '/dashboard', views: '32,140', bounce: '28%' },
    { page: '/projects', views: '28,470', bounce: '35%' },
    { page: '/analytics', views: '19,803', bounce: '40%' },
  ];

  const recentActivity = [
    { action: 'New user registered: Sarah Johnson', time: '2 minutes ago', type: 'user' },
    { action: 'Board "Q4 Planning" created by Mike Chen', time: '15 minutes ago', type: 'board' },
    { action: 'Project "Mobile App" milestone completed', time: '1 hour ago', type: 'project' },
    { action: 'Team member Alex Wong joined Design Team', time: '3 hours ago', type: 'team' },
    { action: 'Task #847 marked as completed by Lisa Park', time: '4 hours ago', type: 'task' },
    { action: 'New comment on "API Documentation"', time: '5 hours ago', type: 'comment' },
    { action: 'Board "Sprint 23" archived', time: '6 hours ago', type: 'board' },
    { action: 'Weekly report generated automatically', time: '8 hours ago', type: 'system' },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user':
        return <IconUsers className="h-4 w-4 text-blue-500" />;
      case 'board':
        return <IconFileText className="h-4 w-4 text-purple-500" />;
      case 'project':
        return <IconChartBar className="h-4 w-4 text-green-500" />;
      case 'team':
        return <IconUsers className="h-4 w-4 text-orange-500" />;
      case 'task':
        return <IconCheck className="h-4 w-4 text-emerald-500" />;
      case 'comment':
        return <IconFileText className="h-4 w-4 text-yellow-500" />;
      default:
        return <IconClock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="px-4 lg:px-6">
        <h1 className="text-3xl font-bold mb-6">Analytics</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4 lg:px-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardDescription>{stat.title}</CardDescription>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <Badge variant="outline" className="gap-1">
                  <IconTrendingUp className="h-3 w-3" />
                  {stat.change}
                </Badge>
                <span className="ml-2">from last month</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 px-4 lg:px-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Traffic Overview</CardTitle>
            <CardDescription>Website visitors over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-75 flex items-center justify-center text-muted-foreground bg-muted/20 rounded-lg">
              <div className="text-center">
                <IconChartBar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Chart component would be rendered here</p>
                <p className="text-xs text-muted-foreground mt-1">Monthly traffic analytics</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Pages</CardTitle>
            <CardDescription>Most visited pages this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPages.map((page, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{page.page}</span>
                    <span className="text-sm text-muted-foreground">{page.views}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Bounce rate: {page.bounce}</span>
                    <span className="text-green-500">↑ {index * 1.5 + 2}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="px-4 lg:px-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest events and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((item, index) => (
                <div key={index} className="flex items-start gap-3 py-2 border-b last:border-0">
                  <div className="mt-0.5">{getActivityIcon(item.type)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{item.action}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {item.time}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
