import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { Decimal } from "@prisma/client/runtime/library";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, location, maxPrice } = body;

        if (!email) {
            return new NextResponse("Email is required", { status: 400 });
        }

        await prisma.reminder.create({
            data: {
                email,
                location: location || null,
                maxPrice: maxPrice ? new Decimal(maxPrice) : null,
            }
        });

        return NextResponse.json({ message: "Reminder set successfully" });
    } catch (error) {
        console.error("[REMINDERS_POST]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}