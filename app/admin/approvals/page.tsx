import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import PropertyApprovalCard from "@/components/admin/PropertyApprovalCard";
import { Property, User } from "@prisma/client"; // Import Prisma types

// --- DEFINE THE TYPE ---
// This creates a new type that includes the Property fields AND the specific seller fields we included.
type PropertyWithSellerInfo = Property & {
  seller: {
    name: string | null;
    email: string;
  };
};

// --- UPDATE THE FUNCTION'S RETURN TYPE ---
async function getPendingProperties(): Promise<PropertyWithSellerInfo[]> {
  const properties = await prisma.property.findMany({
    where: {
      status: 'PENDING',
    },
    include: {
      seller: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: 'asc',
    },
  });
  return properties;
}

const ApprovalsPage = async () => {
  const session = await getServerSession(authOptions);
  // @ts-ignore
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/');
  }

  const pendingProperties = await getPendingProperties();

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-2">Property Approval Queue</h1>
      <p className="text-neutral-500 mb-8">
        You have {pendingProperties.length} properties pending for review.
      </p>

      {pendingProperties.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold">All Caught Up!</h2>
          <p className="text-neutral-600 mt-2">There are no new properties to review at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* --- APPLY THE TYPE TO THE PARAMETER --- */}
          {pendingProperties.map((property: PropertyWithSellerInfo) => (
            <PropertyApprovalCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ApprovalsPage;