import prisma from "@/lib/db";
import AddBuyerForm from "@/components/admin/buyers/AddBuyerForm";
import BuyerList from "@/components/admin/buyers/BuyerList";

// Fetch initial list of buyers on the server
async function getBuyers() {
    return prisma.buyerProfile.findMany({
        orderBy: { createdAt: 'desc' }
    });
}

const BuyersPage = async () => {
    const initialBuyers = await getBuyers();

    return (
        <div >
            <h1 className="text-3xl font-bold">Manage Buyer Profiles</h1>
            <p className="text-neutral-500 mb-8">
                You have {initialBuyers.length} buyers in your database.
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Left Column: Add Form */}
                <div className="lg:col-span-1">
                    <AddBuyerForm />
                </div>
                {/* Right Column: Buyer List */}
                <div className="lg:col-span-2">
                    <BuyerList initialBuyers={initialBuyers} />
                </div>
            </div>
        </div>
    );
};

export default BuyersPage;