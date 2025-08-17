import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Import all the necessary components
import PropertyImageGrid from "@/components/properties/PropertyImageGrid";
import PropertyInfo from "@/components/properties/PropertyInfo";
import PropertyReservationCard from "@/components/properties/PropertyReservationCard";
import HeartButton from "@/components/ui/HeartButton";
import MobileContactFooter from "@/components/properties/MobileContactFooter";
import MobilePropertyHeader from "@/components/properties/MobilePropertyHeader";

// Interface for page parameters
interface IParams {
  propertyId?: string;
}

// --- DATA FETCHING FUNCTIONS ---

// Function to get a single property by its ID
async function getPropertyById(propertyId: string) {
  try {
    const property = await prisma.property.findUnique({
      where: {
        id: propertyId,
        status: 'APPROVED', // Ensure only approved properties can be viewed
      },
      include: {
        seller: {
          select: {
            name: true,
            email: true, // You can choose to use this or not
          }
        }
      }
    });
    return property;
  } catch (error) {
    console.error("Error fetching property:", error);
    return null;
  }
}

// Function to get the currently logged-in user
async function getCurrentUser() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return null;
    }
    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { favoriteProperties: true } // Include favorites for the HeartButton
    });
    return user;
}


// --- THE MAIN PAGE COMPONENT ---

const PropertyPage = async ({ params }: { params: IParams }) => {
  if (!params.propertyId) notFound();
  
  const property = await getPropertyById(params.propertyId);
  const currentUser = await getCurrentUser();

  if (!property) notFound();

  const isFavorited = currentUser?.favoriteProperties?.some((fav: any) => fav.id === property.id) || false;

  return (
    <>
      {/* --- MOBILE-ONLY COMPONENTS --- */}
      <MobilePropertyHeader propertyId={property.id} isFavorited={isFavorited} />

      {/* --- SHARED LAYOUT (DESKTOP & MOBILE) --- */}
      <div className="pb-24 md:pb-0"> {/* Padding bottom for mobile footer */}
          {/* Image Grid Section - No container for mobile, full width */}
          <div className="md:max-w-screen-lg md:mx-auto">
              <PropertyImageGrid imageUrls={property.imageUrls} />
          </div>

          <div className="max-w-screen-lg mx-auto">
              <div className="px-4 sm:px-6 lg:px-10 py-6">
                  {/* Main Content Area */}
                  <div className="grid grid-cols-1 md:grid-cols-7 md:gap-12 mt-0 md:mt-6">
                      {/* Left Column: Info */}
                      <div className="md:col-span-4">
                          {/* Desktop Header */}
                          <div className="hidden md:block">
                              <h1 className="text-2xl font-semibold">{property.title}</h1>
                              <span className="underline cursor-pointer">{property.location}</span>
                          </div>
                          <hr className="my-6 hidden md:block" />
                          <PropertyInfo property={property} />
                      </div>
                      
                      {/* Right Column: Reservation Card - Hidden on Mobile */}
                      <div className="hidden md:block md:col-span-3">
                          <PropertyReservationCard property={property} />
                      </div>
                  </div>
              </div>
          </div>
      </div>

      {/* --- MOBILE-ONLY COMPONENTS --- */}
      <MobileContactFooter property={property} />
    </>
  );
};

export default PropertyPage;