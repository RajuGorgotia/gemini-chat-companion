import { useState } from 'react';
import { Header } from '@/components/Header';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AllQueries } from '@/components/admin/AllQueries';
import { MostUsedQueries } from '@/components/admin/MostUsedQueries';

type AdminView = 'all-queries' | 'most-used-queries';

const Admin = () => {
  const [activeView, setActiveView] = useState<AdminView>('all-queries');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar
          activeView={activeView}
          onSelectView={setActiveView}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <main className="flex-1 overflow-auto p-6">
          {activeView === 'all-queries' && <AllQueries />}
          {activeView === 'most-used-queries' && <MostUsedQueries />}
        </main>
      </div>
    </div>
  );
};

export default Admin;
