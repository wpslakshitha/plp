import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { Decimal } from "@prisma/client/runtime/library";
import { addWatermarkAndUpload } from "@/lib/watermark";

// This function handles POST requests to /api/properties (Creating a new property)
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    const body = await request.json();
    const { title, description, price, location, propertyType, imageUrl, guests, bedrooms, bathrooms, amenities } = body;

    if (!title || !description || !price || !location || !propertyType) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    if (!imageUrl) {
        return new NextResponse("Image is required", { status: 400 });
    }

    const watermarkedImageUrl = await addWatermarkAndUpload(imageUrl);
    
    const numericPrice = new Decimal(price);

    const property = await prisma.property.create({
      data: {
        title,
        description,
        price: numericPrice,
        location,
        propertyType,
        imageUrls: [watermarkedImageUrl],
        status: 'PENDING',
        seller: {
          connect: {
            email: session.user.email,
          }
        },
        guests: parseInt(guests, 10) || 1,
        bedrooms: parseInt(bedrooms, 10) || 1,
        bathrooms: parseInt(bathrooms, 10) || 1,
        amenities: amenities ? amenities.split(',').map((item: string) => item.trim()) : [],
      }
    });

    return NextResponse.json(property);

  } catch (error) {
    console.error("[PROPERTIES_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}


// This function handles GET requests to /api/properties (Fetching properties)
export async function GET(request: Request) {
  try {
    // Security check: Only allow authenticated users (or admins) to access this
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return new NextResponse("Unauthorized", { status: 401 });
    }
    
    const properties = await prisma.property.findMany({
      where: {
        status: 'APPROVED', // Only fetch approved properties for the matchmaking tool
      },
      orderBy: {
        createdAt: 'desc',
      }
    });

    return NextResponse.json(properties);

  } catch (error) {
    console.error("[PROPERTIES_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}