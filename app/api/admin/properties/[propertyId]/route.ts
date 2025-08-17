import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { Property, Reminder } from "@prisma/client";

interface IParams {
  propertyId?: string;
}

// --- SIMULATED EMAIL SERVICE ---
// In a real application, you would use a service like SendGrid, Resend, or Nodemailer.
// This function simulates sending an email by logging to the console.
async function sendReminderEmail(reminder: Reminder, property: Property) {
  // Construct the property URL. Ensure NEXTAUTH_URL is set in your .env file
  const propertyUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/properties/${property.id}`;
  
  console.log("\n=============================================");
  console.log("🚀 SIMULATING EMAIL SEND 🚀");
  console.log("=============================================");
  console.log(`TO: ${reminder.email}`);
  console.log(`SUBJECT: New Property Alert: ${property.title}`);
  console.log("\n--- Body ---");
  console.log(`Hello,`);
  console.log(`A new property matching your criteria has been listed on our platform.`);
  console.log(`\nProperty Details:`);
  console.log(`- Location: ${property.location}`);
  console.log(`- Price: LKR ${property.price.toLocaleString()}`);
  console.log(`\nView it here: ${propertyUrl}`);
  console.log("---------------------------------------------\n");
  
  // Here, you would add your actual email sending logic.
  // For example, using Resend:
  // await resend.emails.send({
  //   from: 'onboarding@resend.dev',
  //   to: reminder.email,
  //   subject: `New Property Alert: ${property.title}`,
  //   react: <ReminderEmailTemplate property={property} />
  // });
}
// --- END OF SIMULATED EMAIL SERVICE ---


// Function to find matching reminders and trigger emails
async function processReminders(property: Property) {
  try {
    const matchingReminders = await prisma.reminder.findMany({
      where: {
        AND: [
          // If a user set a location, the property location must contain it.
          {
            OR: [
              { location: null }, // User wants alerts for any location
              { location: { contains: property.location, mode: 'insensitive' } },
            ]
          },
          // If a user set a max price, the property price must be less than or equal to it.
          {
            OR: [
                { maxPrice: null }, // User wants alerts for any price
                { maxPrice: { gte: property.price } },
            ]
          },
        ],
      },
    });

    console.log(`[INFO] Found ${matchingReminders.length} matching reminders for property ID: ${property.id}`);
    
    // Send an email for each matching reminder
    for (const reminder of matchingReminders) {
      await sendReminderEmail(reminder, property);
    }
  } catch (error) {
    console.error("[REMINDER_PROCESSING_ERROR]", error);
  }
}


export async function PATCH(
  request: Request,
  { params }: { params: IParams }
) {
  try {
    const session = await getServerSession(authOptions);
    const { propertyId } = params;
    const body = await request.json();
    const { status } = body;

    // @ts-ignore
    if (!session?.user || session.user.role !== 'ADMIN') {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!propertyId || typeof propertyId !== 'string') {
      return new NextResponse('Invalid ID', { status: 400 });
    }

    if (!['APPROVED', 'REJECTED'].includes(status)) {
        return new NextResponse("Invalid status value", { status: 400 });
    }
    
    const updatedProperty = await prisma.property.update({
      where: {
        id: propertyId,
      },
      data: {
        status: status,
      },
    });

    // If the property was successfully updated and its new status is 'APPROVED'
    if (status === 'APPROVED' && updatedProperty) {
      console.log(`[INFO] Property ${updatedProperty.id} approved. Starting reminder process...`);
      await processReminders(updatedProperty);
    }

    return NextResponse.json(updatedProperty);
    
  } catch (error) {
    console.error("[PROPERTY_UPDATE_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}