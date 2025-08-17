import { PrismaClient, PropertyType, Role } from '@prisma/client';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// --- NEW FUNCTION to get high-quality images from Unsplash ---
function getRandomUnsplashImage(category: string, width = 800, height = 600): string {
  // We add a random query string to prevent caching and get a different image each time
  const randomCacheBuster = Math.random().toString(36).substring(7);
  return `https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=${width}&h=${height}&auto=format&fit=crop&q=80&ixid=${randomCacheBuster}`;
}

async function main() {
  console.log('Seeding started with high-quality Unsplash images...');

  // --- 1. Create a Demo Seller (No changes here) ---
  const hashedPassword = await bcrypt.hash('password123', 12);
  let seller = await prisma.user.findUnique({ where: { email: 'seller@demo.com' } });
  if (!seller) {
    seller = await prisma.user.create({
      data: {
        email: 'seller@demo.com',
        name: 'Demo Seller',
        hashedPassword,
        role: Role.SELLER,
        kycStatus: 'VERIFIED',
      },
    });
    console.log('Created demo seller account.');
  } else {
    console.log('Demo seller already exists.');
  }

  // --- 2. Clean up old demo properties (No changes here) ---
  await prisma.property.deleteMany({ where: { sellerId: seller.id } });
  console.log('Deleted old demo properties for this seller.');

  // --- 3. Create 120 Demo Properties with Unsplash Images ---
  const propertyTypes: PropertyType[] = ['HOUSE', 'APARTMENT', 'LAND'];
  const locations = ['Colombo', 'Kandy', 'Galle', 'Nuwara Eliya', 'Matara', 'Jaffna', 'Trincomalee', 'Anuradhapura'];

  for (let i = 0; i < 120; i++) {
    const randomPropertyType = faker.helpers.arrayElement(propertyTypes);
    const randomLocation = faker.helpers.arrayElement(locations);
    const bedroomCount = faker.number.int({ min: 1, max: 6 });
    const title = `${bedroomCount} Bedroom ${randomPropertyType.toLowerCase()} in ${randomLocation}`;
    
    await prisma.property.create({
      data: {
        title: title,
        description: faker.lorem.paragraphs({ min: 2, max: 4 }),
        price: faker.number.int({ min: 5000000, max: 150000000 }),
        location: randomLocation,
        propertyType: randomPropertyType,
        status: 'APPROVED',
        // --- UPDATED IMAGE URLS ---
        imageUrls: [
          getRandomUnsplashImage('luxury house exterior'),
          getRandomUnsplashImage('modern living room'),
          getRandomUnsplashImage('minimalist bedroom'),
          getRandomUnsplashImage('sleek kitchen'),
          getRandomUnsplashImage('luxury bathroom'),
        ],
        bedrooms: bedroomCount,
        bathrooms: faker.number.int({ min: 1, max: bedroomCount }),
        guests: bedroomCount * 2,
        amenities: faker.helpers.arrayElements(['Wifi', 'Kitchen', 'Free parking', 'Air conditioning', 'Pool', 'TV', 'Washer'], { min: 3, max: 6 }),
        sellerId: seller.id,
      },
    });
  }
  
  console.log('✅ Successfully seeded 120 new properties with Unsplash images.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });