import PropertyCard from "@/components/properties/PropertyCard";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { Property, PropertyType } from "@prisma/client";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

// --- Reusable Component for Property Sections (No changes) ---
interface PropertyListingSectionProps {
  title: string;
  properties: Property[];
  currentUser: any;
  viewAllLink?: string;
}

const PropertyListingSection: React.FC<PropertyListingSectionProps> = ({ title, properties, currentUser, viewAllLink }) => {
  // If there are no properties, don't render the section at all
  if (properties.length === 0) {
    return null;
  }
  
  return (
    <section className="py-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
        {viewAllLink && (
          <Link href={viewAllLink} className="flex items-center gap-1 font-semibold text-sm hover:underline">
            Show all <ChevronRight size={16} />
          </Link>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-6 gap-y-10">
        {properties.map((property) => (
          <PropertyCard
            key={property.id}
            data={property}
            currentUser={currentUser}
          />
        ))}
      </div>
    </section>
  );
};

// --- Updated Data Fetching Function ---
async function getProperties(filter: any = {}, limit?: number): Promise<Property[]> {
  try {
    const properties = await prisma.property.findMany({
      where: {
        status: 'APPROVED',
        ...filter,
      },
      orderBy: { createdAt: 'desc' },
      take: limit, // Use limit if provided
    });
    return properties;
  } catch (error) {
    console.error("Error fetching properties:", error);
    return [];
  }
}

// --- Get Current User Function (No changes) ---
async function getCurrentUser() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return null;
    return prisma.user.findUnique({
        where: { email: session.user.email },
        include: { favoriteProperties: true }
    });
}

// --- Props interface for the Home page ---
interface HomeProps {
  searchParams: {
    location?: string;
    propertyType?: PropertyType;
  }
}

// --- Main Home Page Component (Completely New Logic) ---
export default async function Home({ searchParams }: HomeProps) {
  const currentUser = await getCurrentUser();
  const hasSearchParams = Object.keys(searchParams).length > 0;

  // If there are search parameters, show only the filtered results.
  if (hasSearchParams) {
    const filter: any = {};
    if (searchParams.location) {
      filter.location = { contains: searchParams.location, mode: 'insensitive' };
    }
    if (searchParams.propertyType) {
      filter.propertyType = searchParams.propertyType;
    }

    const filteredProperties = await getProperties(filter); // Fetch all results, no limit

    return (
      <main className="container mx-auto px-6 lg:px-10 pt-44"> {/* Extra padding for tall navbar */}
        {filteredProperties.length > 0 ? (
          <PropertyListingSection
            title="Search Results"
            properties={filteredProperties}
            currentUser={currentUser}
          />
        ) : (
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold">No Properties Found</h2>
            <p className="text-neutral-500 mt-2">Try adjusting your search filters.</p>
          </div>
        )}
      </main>
    );
  }

  // --- Default view when there are no search parameters ---
  const popularInColombo = await getProperties({ location: { contains: 'Colombo', mode: 'insensitive' } }, 6);
  const newApartments = await getProperties({ propertyType: 'APARTMENT' }, 6);
  const recentHouses = await getProperties({ propertyType: 'HOUSE' }, 6);

  const noPropertiesAvailable = popularInColombo.length === 0 && newApartments.length === 0 && recentHouses.length === 0;

  return (
    <main className="
        container mx-auto px-4 sm:px-6 lg:px-10
        pt-24 md:pt-44 
    ">
      {noPropertiesAvailable ? (
         <div className="text-center py-20">
           <h2 className="text-2xl font-semibold">No Properties Available</h2>
           <p className="text-neutral-500 mt-2">Please check back later.</p>
         </div>
      ) : (
        <>
          <PropertyListingSection 
            title="Popular in Colombo"
            properties={popularInColombo}
            currentUser={currentUser}
          />
          <PropertyListingSection 
            title="Newly Listed Apartments"
            properties={newApartments}
            currentUser={currentUser}
          />
          <PropertyListingSection 
            title="Available Houses"
            properties={recentHouses}
            currentUser={currentUser}
          />
        </>
      )}
    </main>
  );
}