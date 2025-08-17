import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from 'next/link';

const AdminDashboardPage = async () => {
  const session = await getServerSession(authOptions);

  // This requires updating our session callback to include the user's role.
  // We will do that in the next step. For now, let's assume we can check the role.
  // @ts-ignore
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/'); // Redirect if not logged in or not an ADMIN
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <p className="mb-8 text-lg">System Administration Panel</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/admin/matchmaking">
  <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
    <h2 className="text-xl font-semibold mb-2">Matchmaking Tool</h2>
    <p>Find potential buyers for approved properties.</p>
  </div>
</Link>
<Link href="/admin/buyers">
  <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
    <h2 className="text-xl font-semibold mb-2">Buyer Profiles</h2>
    <p>Manage and add potential buyer information.</p>
  </div>
</Link>
        <Link href="/admin/approvals">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
            <h2 className="text-xl font-semibold mb-2">Property Approvals</h2>
            <p>Review and manage new property submissions.</p>
          </div>
        </Link>
        {/* We can add more admin cards here later, like User Management */}
      </div>
    </div>
  );
};

export default AdminDashboardPage;