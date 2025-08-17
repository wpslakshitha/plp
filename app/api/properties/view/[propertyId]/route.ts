import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import crypto from 'crypto';

export async function POST(req: NextRequest, { params }: { params: { propertyId: string } }) {
    const { propertyId } = params;
    const session = await getServerSession(authOptions);

    // Get a unique identifier for the viewer
    let viewerHash: string;
    if (session?.user?.id) {
        viewerHash = session.user.id;
    } else {
        const ip = req.ip ?? req.headers.get('x-forwarded-for') ?? 'anonymous';
        viewerHash = crypto.createHash('sha256').update(ip).digest('hex');
    }
    
    try {
        await prisma.propertyView.create({
            data: {
                propertyId: propertyId,
                userId: session?.user?.id,
                viewerHash: viewerHash,
            },
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        // This will fail if the view already exists, which is the expected behavior.
        // We can just return a success message as the view is "counted".
        return NextResponse.json({ success: true, message: "View already counted." });
    }
}