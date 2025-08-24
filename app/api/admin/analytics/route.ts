import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { startOfMonth, endOfMonth, subMonths, format } from 'date-fns';

export async function GET(request: Request) {
    // Add security check for admin role here
    
    // 1. Most Viewed Properties (Top 5)
    const mostViewedProperties = await prisma.property.findMany({
        where: { status: 'APPROVED' },
        orderBy: { views: { _count: 'desc' } },
        take: 5,
        select: { title: true, _count: { select: { views: true } } }
    });

    // 2. Views by Location
    const viewsByLocation = await prisma.propertyView.groupBy({
        by: ['propertyId'],
        _count: { propertyId: true },
        orderBy: { _count: { propertyId: 'desc' } },
    });
    // Further processing needed to group by location string, not just ID.

    // 3. Monthly Views (Last 6 Months)
    const monthlyViews = [];
    for (let i = 5; i >= 0; i--) {
        const date = subMonths(new Date(), i);
        const startDate = startOfMonth(date);
        const endDate = endOfMonth(date);
        
        const count = await prisma.propertyView.count({
            where: { createdAt: { gte: startDate, lte: endDate } }
        });

        monthlyViews.push({
            name: format(date, 'MMM'), // e.g., 'Jan', 'Feb'
            views: count
        });
    }

    return NextResponse.json({ mostViewedProperties, monthlyViews });
}