import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  
  // @ts-ignore
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/');
  }

  return (
    <div className="bg-neutral-50 min-h-screen">
        <AdminSidebar />
        {/* Responsive padding: pt-20 for mobile header, md:pt-8 for desktop.
            md:ml-64 to leave space for the desktop sidebar */}
        <main className="flex-1 p-8 pt-20 md:pt-8 md:ml-64 md:pt-[90px]">
            {children}
        </main>
    </div>
  );
}