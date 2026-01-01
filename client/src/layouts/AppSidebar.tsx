'use client';

import * as React from 'react';
import { Link } from 'react-router-dom';
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
} from '@tabler/icons-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { NavMain } from '@/components/common/nav/NavMain';
import { NavDocuments } from '@/components/common/nav/NavDocuments';
import { NavSecondary } from '@/components/common/nav/NavSecondary';
import { NavUser } from '@/components/common/nav/NavUser';
import { t } from 'i18next';

const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=shadcn',
  },
};

const SIDEBAR = {
  navMain: [
    {
      title: t('dashboard.sidebar.navMain.dashboard'),
      url: '/',
      icon: IconDashboard,
    },
    {
      title: t('dashboard.sidebar.navMain.boards'),
      url: '/boards',
      icon: IconListDetails,
    },
    {
      title: t('dashboard.sidebar.navMain.analytics'),
      url: '/analytics',
      icon: IconChartBar,
    },
    {
      title: t('dashboard.sidebar.navMain.projects'),
      url: '/projects',
      icon: IconFolder,
    },
    {
      title: t('dashboard.sidebar.navMain.team'),
      url: '/team',
      icon: IconUsers,
    },
  ],
  navClouds: [
    {
      title: t('dashboard.sidebar.navClouds.capture'),
      icon: IconCamera,
      isActive: true,
      url: '#',
      items: [
        {
          title: t('dashboard.sidebar.navClouds.activeProposals'),
          url: '#',
        },
        {
          title: t('dashboard.sidebar.navClouds.archived'),
          url: '#',
        },
      ],
    },
    {
      title: t('dashboard.sidebar.navClouds.proposal'),
      icon: IconFileDescription,
      url: '#',
      items: [
        {
          title: t('dashboard.sidebar.navClouds.activeProposals'),
          url: '#',
        },
        {
          title: t('dashboard.sidebar.navClouds.archived'),
          url: '#',
        },
      ],
    },
    {
      title: t('dashboard.sidebar.navClouds.prompts'),
      icon: IconFileAi,
      url: '#',
      items: [
        {
          title: t('dashboard.sidebar.navClouds.activeProposals'),
          url: '#',
        },
        {
          title: t('dashboard.sidebar.navClouds.archived'),
          url: '#',
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: t('dashboard.sidebar.navSecondary.settings'),
      url: '#',
      icon: IconSettings,
    },
    {
      title: t('dashboard.sidebar.navSecondary.getHelp'),
      url: '#',
      icon: IconHelp,
    },
    {
      title: t('dashboard.sidebar.navSecondary.search'),
      url: '#',
      icon: IconSearch,
    },
  ],
  documents: [
    {
      name: t('dashboard.sidebar.documents.dataLibrary'),
      url: '#',
      icon: IconDatabase,
    },
    {
      name: t('dashboard.sidebar.documents.reports'),
      url: '#',
      icon: IconReport,
    },
    {
      name: t('dashboard.sidebar.documents.wordAssistant'),
      url: '#',
      icon: IconFileWord,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:p-1.5!">
              <Link to="/">
                <IconInnerShadowTop className="size-5!" />
                <span className="text-base font-semibold">
                  {t('dashboard.sidebar.companyName')}
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={SIDEBAR.navMain} />
        <NavDocuments items={SIDEBAR.documents} />
        <NavSecondary items={SIDEBAR.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
