import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import PropertyApprovalCard from "@/components/admin/PropertyApprovalCard";
import { Property } from "@prisma/client";

type PropertyWithSellerInfo = Property & {
  seller: { name: string | null; email: string; };
};

async function getPendingProperties(): Promise<PropertyWithSellerInfo[]> {
  const properties = await prisma.property.findMany({
    where: { status: 'PENDING' },
    include: { seller: { select: { name: true, email: true } } },
    orderBy: { createdAt: 'asc' },
  });
  return properties;
}

const ApprovalsPage = async () => {
  const pendingProperties = await getPendingProperties();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Property Approval Queue</h1>
      <p className="text-neutral-500 mb-8">
        You have {pendingProperties.length} properties pending for review.
      </p>

      {pendingProperties.length === 0 ? (
        <div className="text-center bg-white p-12 rounded-2xl border border-dashed">
          <h2 className="text-2xl font-semibold">All Caught Up!</h2>
          <p className="text-neutral-600 mt-2">There are no new properties to review at the moment.</p>
        </div>
      ) : (
        // Changed from grid to a flex column with space
        <div className="flex flex-col gap-4">
          {pendingProperties.map((property: PropertyWithSellerInfo) => (
            <PropertyApprovalCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ApprovalsPage;