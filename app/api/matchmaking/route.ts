import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { Property, PropertyType } from "@prisma/client";

export async function POST(request: Request) {
    const { property }: { property: Property } = await request.json();

    if (!property) {
        return new NextResponse("Property data is required", { status: 400 });
    }

    const matchingBuyers = await prisma.buyerProfile.findMany({
        where: {
            AND: [
                // Condition 1: Location must match OR buyer has no location preference
                {
                    OR: [
                        { desiredLocation: null },
                        { desiredLocation: { equals: '', mode: 'insensitive' } }, // Check for empty string
                        { desiredLocation: { contains: property.location, mode: 'insensitive' } }
                    ]
                },
                // Condition 2: Property Type must match OR buyer's preference is ANY/null
                {
                    OR: [
                        { propertyType: null },
                        // 'ANY' is not in the schema, so we don't check for it.
                        // A null propertyType in BuyerProfile implies they are open to any type.
                        { propertyType: property.propertyType }
                    ]
                },
                // Condition 3: Property price must be within buyer's budget
                {
                    OR: [
                        { minBudget: null },
                        { minBudget: { lte: property.price } }
                    ]
                },
                {
                    OR: [
                        { maxBudget: null },
                        { maxBudget: { gte: property.price } }
                    ]
                }
            ]
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
    
    return NextResponse.json(matchingBuyers);
}