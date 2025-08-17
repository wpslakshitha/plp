import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { Property } from "@prisma/client";

export async function POST(request: Request) {
    const { property }: { property: Property } = await request.json();

    if (!property) {
        return new NextResponse("Property data is required", { status: 400 });
    }

    const query: any = {
        where: {
            AND: [],
        },
    };

    // Match location if buyer has specified one
    if (property.location) {
        query.where.AND.push({ desiredLocation: { contains: property.location, mode: 'insensitive' } });
    }
    // Match property type if buyer has specified one
    if (property.propertyType) {
        query.where.AND.push({ propertyType: property.propertyType });
    }
    // Match budget: property price must be within buyer's budget range
    query.where.AND.push({
        OR: [
            { minBudget: null, maxBudget: null }, // Buyer has no budget preference
            { minBudget: { lte: property.price }, maxBudget: { gte: property.price } },
            { minBudget: { lte: property.price }, maxBudget: null }, // No max budget
            { minBudget: null, maxBudget: { gte: property.price } }, // No min budget
        ]
    });
    
    const matchingBuyers = await prisma.buyerProfile.findMany(query);
    
    return NextResponse.json(matchingBuyers);
}