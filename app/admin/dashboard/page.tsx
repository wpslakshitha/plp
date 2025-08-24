import prisma from "@/lib/db";
import { FiUsers, FiClock, FiCheckCircle } from "react-icons/fi";
import { startOfMonth, endOfMonth, subMonths, format } from 'date-fns';
import AnalyticsClientPage from "@/components/admin/analytics/AnalyticsClientPage";

// --- SERVER-SIDE DATA FETCHING ---
async function getDashboardData() {
    // Stat Cards Data
    const pendingCount = await prisma.property.count({ where: { status: 'PENDING' } });
    const buyerCount = await prisma.buyerProfile.count();
    const approvedCount = await prisma.property.count({ where: { status: 'APPROVED' } });

    // Chart Data
    // 1. Most Viewed Properties (Top 5)
    const mostViewedPropertiesRaw = await prisma.property.findMany({
        where: { status: 'APPROVED' },
        orderBy: { views: { _count: 'desc' } },
        take: 5,
        select: { title: true, _count: { select: { views: true } } }
    });
    const mostViewedProperties = mostViewedPropertiesRaw.map(p => ({
        name: p.title.length > 15 ? `${p.title.substring(0, 15)}...` : p.title,
        views: p._count.views
    }));

    // 2. Monthly Views (Last 6 Months)
    const monthlyViews = [];
    for (let i = 5; i >= 0; i--) {
        const date = subMonths(new Date(), i);
        const count = await prisma.propertyView.count({
            where: { createdAt: { gte: startOfMonth(date), lte: endOfMonth(date) } }
        });
        monthlyViews.push({ name: format(date, 'MMM'), views: count });
    }
    
    // 3. Views by Location
    const propertiesWithLocationsAndViews = await prisma.property.findMany({
        where: { status: 'APPROVED' },
        include: { _count: { select: { views: true } } }
    });
    const viewsByLocation = propertiesWithLocationsAndViews
        .reduce((acc, prop) => {
            acc[prop.location] = (acc[prop.location] || 0) + prop._count.views;
            return acc;
        }, {} as Record<string, number>);
    
    const topLocations = Object.entries(viewsByLocation)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([name, views]) => ({ name, views }));
        
    return {
        stats: { pendingCount, buyerCount, approvedCount },
        charts: { mostViewedProperties, monthlyViews, topLocations }
    };
}


// --- Main Admin Dashboard Page ---
const AdminDashboardPage = async () => {
    const data = await getDashboardData();
    
    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Analytics Dashboard</h1>
            {/* The client component will handle rendering all the charts and filters */}
            <AnalyticsClientPage data={data} />
        </div>
    );
};

export default AdminDashboardPage;