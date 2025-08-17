import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import PropertyCard from "@/components/properties/PropertyCard";
import Link from "next/link";

async function getFavoriteProperties(userEmail: string) {
  const user = await prisma.user.findUnique({
    where: {
      email: userEmail,
    },
    include: {
      favoriteProperties: { // Fetch all properties in the favoriteProperties relation
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });
  return user?.favoriteProperties || [];
}

const FavoritesPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect('/'); // Redirect unauthenticated users to homepage
  }
  
  const favoriteProperties = await getFavoriteProperties(session.user.email);
  const currentUser = await prisma.user.findUnique({ where: { email: session.user.email }, include: { favoriteProperties: true }});

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">My Favorites</h1>
      
      {favoriteProperties.length === 0 ? (
        <div className="text-center py-20">
          <h2 className="text-2xl font-semibold">You have no favorites yet.</h2>
          <p className="text-neutral-500 mt-2">
            Click the heart icon on any property to save it here.
          </p>
          <div className="mt-6">
            <Link href="/" className="bg-rose-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-rose-600 transition">
              Discover Properties
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
          {favoriteProperties.map((property) => (
            <PropertyCard
              key={property.id}
              data={property}
              currentUser={currentUser}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;