import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// This GET function fetches the raw data for a single property for editing.
export async function GET(request: Request, { params }: { params: { propertyId: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return new NextResponse("Unauthorized", { status: 401 });
    }
    
    const property = await prisma.property.findFirst({
      where: {
        id: params.propertyId,
        sellerId: session.user.id, // Security: Ensure the seller owns this property
      }
    });

    if (!property) {
      return new NextResponse("Property not found or access denied", { status: 404 });
    }

    // Convert amenities array back to a comma-separated string for the form input
    const formData = {
        ...property,
        price: property.price.toString(), // Convert Decimal to string
        amenities: property.amenities.join(', '),
    };

    return NextResponse.json(formData);

  } catch (error) {
    console.error("[PROPERTY_DATA_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}