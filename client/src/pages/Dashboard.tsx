import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/layouts/AppSidebar';
import { SiteHeader } from './components/SiteHeader';
import { SectionCards } from './components/SectionCards';
import { ChartAreaInteractive } from './components/ChartAreaInteractive';
import { DataTable } from './components/DataTable';
import data from './data/data.json'

interface CustomStyle extends React.CSSProperties {
  '--sidebar-width'?: string;
  '--header-height'?: string;
}

export default function Dashboard() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <SectionCards />
        <div className="px-4 lg:px-6">
          <ChartAreaInteractive />
        </div>
        <DataTable data={data} />
      </div>
    </div>
  );
}
