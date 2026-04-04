'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMe } from '@/hooks/useAuth';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { IntegrationProvider } from '@/contexts/IntegrationContext';
import { SidebarProvider, useSidebar } from '@/contexts/SidebarContext';
import { cn } from '@/lib/utils';

function ProtectedLayoutInner({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: user, isLoading, isError } = useMe();
  const { collapsed } = useSidebar();

  useEffect(() => {
    if (!isLoading && isError) {
      router.replace('/login');
    }
  }, [isLoading, isError, router]);

  if (isLoading || !user) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 bg-black text-white flex items-center justify-center font-black italic text-xl animate-pulse">U</div>
          <span className="text-[10px] technical-label text-neutral-400 uppercase tracking-widest">Authenticating...</span>
        </div>
      </div>
    );
  }

  return (
    <IntegrationProvider>
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <div className={cn('flex-1 flex flex-col min-w-0 transition-all duration-300', collapsed ? 'pl-16' : 'pl-64')}>
            <TopBar />
            <main className="flex-1 overflow-y-auto p-8">
              {children}
            </main>
          </div>
        </div>
    </IntegrationProvider>
  );
}

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <ProtectedLayoutInner>{children}</ProtectedLayoutInner>
    </SidebarProvider>
  );
}
