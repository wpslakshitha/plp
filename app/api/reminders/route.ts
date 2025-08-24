import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { Decimal } from "@prisma/client/runtime/library";

export async function POST(request: Request) {
    const body = await request.json();
    const { phone, location, propertyType, maxPrice } = body;

    if (!phone) {
        return new NextResponse("Phone number is required", { status: 400 });
    }

    await prisma.reminder.create({
        data: {
            phone,
            location: location || null,
            propertyType: propertyType === 'ANY' ? null : propertyType,
            maxPrice: maxPrice ? new Decimal(maxPrice) : null,
        }
    });

    return NextResponse.json({ message: "Alert set successfully!" });
}