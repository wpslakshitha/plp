import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import prisma from "@/lib/db";
import DashboardStats from "@/components/seller/DashboardStats";
import PropertyList from "@/components/seller/PropertyListTable";

async function getSellerProperties(userId: string) {
  const properties = await prisma.property.findMany({
    where: { sellerId: userId },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { views: true },
      },
    },
  });
  return properties;
}

const SellerDashboardPage = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/");
  }

  const properties = await getSellerProperties(session.user.id);

  const total = properties.length;
  const approved = properties.filter((p) => p.status === "APPROVED").length;
  const pending = properties.filter((p) => p.status === "PENDING").length;
  const rejected = properties.filter((p) => p.status === "REJECTED").length;

  return (
    <div className="bg-neutral-50 min-h-screen">
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-neutral-800">Dashboard</h1>
            <p className="text-neutral-500">
              Welcome back, {session.user.name}!
            </p>
          </div>
          <Link href="/seller/properties/new" className="pl-2 pr-2">
            <button className="flex items-center gap-2 px-6 py-3 bg-rose-500 text-white font-bold rounded-lg">
              + New Property
            </button>
          </Link>
        </div>

        <DashboardStats
          total={total}
          approved={approved}
          pending={pending}
          rejected={rejected}
        />

        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4 text-neutral-800">
            Your Listings
          </h2>
          {properties.length > 0 ? (
            <PropertyList properties={properties} />
          ) : (
            <div className="text-center bg-white p-12 rounded-2xl border border-dashed">
              <h3 className="text-xl font-semibold">No Properties Yet</h3>
              <p className="text-neutral-500 mt-2">
                Click the button above to list your first property.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerDashboardPage;
