import { SideNav } from '@/components/SideNav';
import { Toaster } from '@/components/ui/toaster';

export default function CommonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen font-inter">
      <SideNav />
      <main className="flex min-h-screen grow flex-col">{children}</main>
      <Toaster />
    </div>
  );
}