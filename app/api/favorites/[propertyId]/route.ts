import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

interface IParams {
  propertyId?: string;
}

// Add a property to favorites
export async function POST(
  request: Request,
  { params }: { params: IParams }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { propertyId } = params;

  if (!propertyId || typeof propertyId !== 'string') {
    throw new Error('Invalid ID');
  }

  const user = await prisma.user.update({
    where: { email: session.user.email },
    data: {
      favoriteProperties: {
        connect: { id: propertyId }
      }
    }
  });

  return NextResponse.json(user);
}

// Remove a property from favorites
export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  
  const { propertyId } = params;

  if (!propertyId || typeof propertyId !== 'string') {
    throw new Error('Invalid ID');
  }

  const user = await prisma.user.update({
    where: { email: session.user.email },
    data: {
      favoriteProperties: {
        disconnect: { id: propertyId }
      }
    }
  });

  return NextResponse.json(user);
}