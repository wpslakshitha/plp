import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { Decimal } from "@prisma/client/runtime/library";

// PATCH (Update) a single buyer
export async function PATCH(request: Request, { params }: { params: { buyerId: string } }) {
    const body = await request.json();
    const { name, email, phone, desiredLocation, minBudget, maxBudget, propertyType } = body;

    const updatedBuyer = await prisma.buyerProfile.update({
        where: { id: params.buyerId },
        data: {
            name, email, phone, desiredLocation, propertyType,
            minBudget: minBudget ? new Decimal(minBudget) : null,
            maxBudget: maxBudget ? new Decimal(maxBudget) : null,
        }
    });
    return NextResponse.json(updatedBuyer);
}

// DELETE a single buyer
export async function DELETE(request: Request, { params }: { params: { buyerId: string } }) {
    await prisma.buyerProfile.delete({
        where: { id: params.buyerId }
    });
    return NextResponse.json({ message: "Buyer deleted" });
}