import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import Image from "next/image";
import AdminPropertyActions from "@/components/admin/AdminPropertyActions";
import { FiGrid, FiHome, FiTag, FiUser } from "react-icons/fi";
import { ReactNode } from "react";
import { IconType } from "react-icons";

async function getPropertyForAdmin(propertyId: string) {
  try {
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      include: { seller: { select: { name: true, email: true } } }
    });
    return property;
  } catch (error) {
    console.error("Error fetching property for admin:", error);
    return null;
  }
}

const InfoSection = ({ title, children, icon: Icon }: { title: string, children: ReactNode, icon?: IconType }) => (
    <div className="py-6 border-b last:border-b-0">
        <div className="flex items-center gap-3 mb-4">
            {Icon && <Icon className="text-neutral-500" size={20} />}
            <h2 className="text-xl font-semibold text-neutral-800">{title}</h2>
        </div>
        {children}
    </div>
);

const InfoDetail = ({ label, value }: { label: string, value: ReactNode }) => (
    <div className="flex justify-between items-center text-base">
        <p className="text-neutral-500">{label}</p>
        <p className="font-semibold text-neutral-800 text-right">{value}</p>
    </div>
);

const AdminPropertyReviewPage = async ({ params }: { params: { propertyId: string } }) => {
  if (!params.propertyId) {
    notFound();
  }
  
  const property = await getPropertyForAdmin(params.propertyId);
  if (!property) {
    notFound();
  }

  const priceAsNumber = Number(property.price);

  return (
    <>
      <div className="pb-24 md:pt-[100px]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-8">
            {property.imageUrls.slice(0, 4).map((url, i) => (
               <div key={i} className={`
                relative aspect-video rounded-lg overflow-hidden
                ${i === 0 ? 'col-span-2 row-span-2' : ''}
               `}>
                 <Image src={url} alt={`Property Image ${i+1}`} fill className="object-cover"/>
               </div>
            ))}
        </div>
        
        <div className="max-w-4xl mx-auto">
            <div className="border-b pb-6">
                <p className="text-neutral-500">{property.location}</p>
                <h1 className="text-4xl font-bold text-neutral-900 mt-1">{property.title}</h1>
            </div>

            <InfoSection title="Key Information" icon={FiGrid}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                    <InfoDetail label="Price" value={`LKR ${priceAsNumber.toLocaleString('en-US')}`} />
                    <InfoDetail label="Property Type" value={property.propertyType} />
                    <InfoDetail label="Bedrooms" value={property.bedrooms} />
                    <InfoDetail label="Bathrooms" value={property.bathrooms} />
                    <InfoDetail label="Max Guests" value={property.guests} />
                </div>
            </InfoSection>

            <InfoSection title="Seller Information" icon={FiUser}>
                 <InfoDetail label="Name" value={property.seller.name} />
                 <InfoDetail label="Email" value={property.seller.email} />
            </InfoSection>

            <InfoSection title="Description" icon={FiHome}>
                <p className="text-neutral-700 whitespace-pre-wrap leading-relaxed">
                    {property.description}
                </p>
            </InfoSection>

            <InfoSection title="Amenities" icon={FiTag}>
                <div className="flex flex-wrap gap-2">
                    {property.amenities.map(amenity => (
                        <div key={amenity} className="bg-neutral-100 text-neutral-700 text-sm px-3 py-1 rounded-full">
                            {amenity}
                        </div>
                    ))}
                </div>
            </InfoSection>
        </div>
      </div>
      
      <AdminPropertyActions propertyId={property.id} currentStatus={property.status} />
    </>
  );
};

export default AdminPropertyReviewPage;