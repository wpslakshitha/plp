import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import prisma from "@/lib/db";
import DashboardStats from "@/components/seller/DashboardStats";
import PropertyListTable from "@/components/seller/PropertyListTable";

// Function to fetch all properties for the logged-in seller
async function getSellerProperties(userId: string) {
    const properties = await prisma.property.findMany({
        where: { sellerId: userId },
        orderBy: { createdAt: 'desc' },
        include: {
            _count: {
                select: { views: true }
            }
        }
    });
    return properties;
}

const SellerDashboardPage = async () => {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        redirect("/");
    }
    
    const properties = await getSellerProperties(session.user.id);

    // Calculate stats
    const total = properties.length;
    const approved = properties.filter(p => p.status === 'APPROVED').length;
    const pending = properties.filter(p => p.status === 'PENDING').length;
    const rejected = properties.filter(p => p.status === 'REJECTED').length;

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="flex flex-wrap justify-between items-center gap-4 mb-6 pt-20">
                <h1 className="text-3xl font-bold">Seller Dashboard</h1>
                <Link href="/seller/properties/new">
                    <Button label="+ List a New Property" className="ml-2 mr-2" />
                </Link>
            </div>
            
            <DashboardStats total={total} approved={approved} pending={pending} rejected={rejected} />

            <div className="bg-white p-6 rounded-lg shadow-md mt-8">
                <h2 className="text-2xl font-semibold mb-4">Your Listings</h2>
                {properties.length > 0 ? (
                    <PropertyListTable properties={properties} />
                ) : (
                    <p className="text-neutral-500">You haven't listed any properties yet.</p>
                )}
            </div>
        </div>
    );
};

export default SellerDashboardPage;