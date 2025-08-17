import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { Decimal } from "@prisma/client/runtime/library";

export async function POST(request: Request) {
    // Add admin session check here for security
    const body = await request.json();
    const { name, email, phone, desiredLocation, minBudget, maxBudget, propertyType } = body;

    if (!name || !email) {
        return new NextResponse("Name and Email are required", { status: 400 });
    }

    const buyerProfile = await prisma.buyerProfile.create({
        data: {
            name, email, phone, desiredLocation, propertyType,
            minBudget: minBudget ? new Decimal(minBudget) : null,
            maxBudget: maxBudget ? new Decimal(maxBudget) : null,
        }
    });

    return NextResponse.json(buyerProfile);
}