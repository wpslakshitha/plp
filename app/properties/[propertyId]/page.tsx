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
import DesktopShareButton from "@/components/properties/DesktopShareButton";
import ViewTracker from "@/components/properties/ViewTracker";

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
    <ViewTracker propertyId={property.id} />
      {/* --- MOBILE-ONLY HEADER with new props --- */}
      <MobilePropertyHeader 
        propertyId={property.id} 
        isFavorited={isFavorited}
        title={property.title}
        location={property.location}
      />

      <div className="pb-24 md:pb-0">
          <div className="md:max-w-screen-lg md:mx-auto md:pt-[100px]">
              <PropertyImageGrid imageUrls={property.imageUrls} />
          </div>

          <div className="max-w-screen-lg mx-auto">
              <div className="px-4 sm:px-6 lg:px-10 py-6">
                  {/* --- DESKTOP-ONLY HEADER --- */}
                  <div className="hidden md:block">
                      <h1 className="text-2xl font-semibold">{property.title}</h1>
                      <div className="flex items-center justify-between text-sm font-light text-neutral-600 mt-2">
                          <span className="underline cursor-pointer">{property.location}</span>
                          <div className="flex items-center gap-4">
                              <DesktopShareButton />
                              <div className="flex items-center gap-2">
                                  <HeartButton propertyId={property.id} isFavorited={isFavorited} />
                                  <span className="hover:underline cursor-pointer">Save</span>
                              </div>
                          </div>
                      </div>
                  </div>
                  
                  {/* Main Content Area */}
                  <div className="grid grid-cols-1 md:grid-cols-7 md:gap-12 mt-6">
                      <div className="md:col-span-4">
                          <PropertyInfo property={property} />
                      </div>
                      <div className="hidden md:block md:col-span-3">
                          <PropertyReservationCard property={property} />
                      </div>
                  </div>
              </div>
          </div>
      </div>

      <MobileContactFooter property={property} />
    </>
  );
};

export default PropertyPage;