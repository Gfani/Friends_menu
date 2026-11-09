import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding F.R.I.E.N.D.S Restaurant Database...');

  // 1. Seed Admin
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.admin.upsert({
    where: { email: 'admin@friends.com' },
    update: {
      password: adminPassword,
      name: 'Gunther (Manager)',
    },
    create: {
      email: 'admin@friends.com',
      password: adminPassword,
      name: 'Gunther (Manager)',
    },
  });
  console.log(`👤 Admin created: ${admin.email} (Password: admin123)`);

  // 2. Categories & Items Data
  const categoriesData = [
    {
      name: 'Pasta',
      slug: 'pasta',
      description: 'Handcrafted Italian pasta simmered in authentic herbs and garden-fresh sauces.',
      icon: 'Soup',
      sortOrder: 1,
      items: [
        {
          name: 'Spaghetti with tomato',
          price: 230,
          description: 'Classic al dente spaghetti tossed in slow-cooked San Marzano tomato sauce, fresh basil, and virgin olive oil.',
          tags: 'Vegetarian,Classic',
          image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Spaghetti with vegetable',
          price: 230,
          description: 'Sautéed zucchini, bell peppers, garden carrots, and broccoli tossed with light garlic-infused spaghetti.',
          tags: 'Vegetarian,Garden Fresh',
          image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281724?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Spaghetti with meat',
          price: 270,
          description: 'Tender seasoned minced beef simmered in rich herbaceous red sauce over twisted spaghetti strands.',
          tags: 'Hearty,Chef Special',
          image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Spaghetti with carbonara sauce',
          price: 280,
          description: 'Rich velvety egg yolk and parmesan sauce with crispy cured bites and fresh cracked black pepper.',
          tags: 'House Favorite,Rich',
          image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Spaghetti with bologna sauce',
          price: 280,
          description: 'Slow-simmered authentic Bolognese ragù with minced beef, garden herbs, and aged parmesan dusting.',
          tags: 'Traditional,Signature',
          image: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Penne with meat',
          price: 270,
          description: 'Fluted penne pasta catching every drop of savory spiced beef reduction and fresh parsley.',
          tags: 'Hearty',
          image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Penne with cream sauce',
          price: 280,
          description: 'Silky smooth garlic-parmesan cream sauce blanketing tubular penne with a dash of cracked nutmeg.',
          tags: 'Vegetarian,Creamy',
          image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Lasagna',
          price: null,
          description: 'Layered sheet pasta, creamy béchamel, golden mozzarella crust, and market-fresh seasonal vegetables.',
          tags: 'Market Special,Vegetarian',
          image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Lasagna with meat sauce',
          price: null,
          description: 'Grandma-style baked lasagna layered with savory beef ragù, ricotta, and bubbling golden cheese.',
          tags: 'House Special,Comfort Food',
          image: 'https://images.unsplash.com/photo-1619895092538-128341789043?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Lasagna with carbonara sauce',
          price: null,
          description: 'Decadent baked fusion lasagna layered with velvety carbonara cream, cured bits, and pecorino cheese.',
          tags: 'Chef Specialty',
          image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Telatelli',
          price: null,
          description: 'Hand-cut flat ribbon tagliatelle pasta served with the chef’s daily garden butter or seasonal truffle glaze.',
          tags: 'Artisanal,Market Price',
          image: 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?auto=format&fit=crop&w=800&q=80',
        },
      ],
    },
    {
      name: 'Rice',
      slug: 'rice',
      description: 'Fluffy fragrant basmati rice prepared with savory broths, garden herbs, and flame-grilled proteins.',
      icon: 'Utensils',
      sortOrder: 2,
      items: [
        {
          name: 'Vegetable rice',
          price: 230,
          description: 'Fluffy long-grain rice wok-fried with crisp carrots, sweet peas, corn, bell peppers, and scallions.',
          tags: 'Vegetarian,Gluten-Free',
          image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Rice with chicken',
          price: 250,
          description: 'Tender spiced chicken breast strips served atop golden seasoned pilaf with caramelized onion glaze.',
          tags: 'High Protein,Popular',
          image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Rice with fish',
          price: 250,
          description: 'Pan-seared lake fish fillet seasoned with rosemary, garlic, and lemon, resting on herb-infused rice.',
          tags: 'Fresh Catch,Gluten-Free',
          image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Rice with meat',
          price: 245,
          description: 'Succulent marinated beef morsels simmered in onion-garlic reduction served over aromatic steamed rice.',
          tags: 'Hearty,Favorite',
          image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
        },
      ],
    },
    {
      name: 'Salad',
      slug: 'salad',
      description: 'Crisp garden greens, vine-ripened tomatoes, and house-made artisan dressings.',
      icon: 'Salad',
      sortOrder: 3,
      items: [
        {
          name: 'Special salad',
          price: 280,
          description: 'Mereba Garden signature bowl: mixed organic lettuce, avocado, roasted nuts, cherry tomatoes, and citrus vinaigrette.',
          tags: 'Signature,Vegetarian',
          image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Mixed salad',
          price: 250,
          description: 'Crispy cucumber, red onion slivers, shredded carrots, and colorful peppers over tender green leaves.',
          tags: 'Vegetarian,Light',
          image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Tuna salad',
          price: 230,
          description: 'Flaked premium tuna, boiled eggs, sweet corn, capers, and crunchy romaine dressed in lemon-herb oil.',
          tags: 'Protein-Packed',
          image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Chicken salad',
          price: 305,
          description: 'Grilled herb chicken breast slices, crunchy garlic croutons, parmesan shavings, and house dressing.',
          tags: 'Bestseller',
          image: 'https://images.unsplash.com/photo-1580013759032-c96505e24c1f?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Mayonnaise salad',
          price: 280,
          description: 'Classic creamy potato and vegetable salad folded in creamy mayonnaise with a hint of Dijon mustard.',
          tags: 'Comfort Salad',
          image: 'https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Avocado salad',
          price: 230,
          description: 'Freshly sliced ripe highland avocados, diced red onions, and lime-cilantro dressing.',
          tags: 'Vegan,Fresh',
          image: 'https://images.unsplash.com/photo-1529059997568-3d847b1154f0?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Tomato salad',
          price: 230,
          description: 'Sun-ripened farm tomatoes, thinly sliced red shallots, fresh basil, and extra virgin olive oil.',
          tags: 'Vegan,Classic',
          image: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985b?auto=format&fit=crop&w=800&q=80',
        },
      ],
    },
    {
      name: 'Soup',
      slug: 'soup',
      description: 'Slow-simmered, warming garden broths served piping hot with freshly baked breadsticks.',
      icon: 'CupSoda',
      sortOrder: 4,
      items: [
        {
          name: 'Vegetable soup',
          price: 150,
          description: 'Clear golden broth infused with leeks, carrots, celery, potatoes, and fragrant thyme.',
          tags: 'Vegetarian,Light',
          image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Chicken soup',
          price: 230,
          description: 'Traditional healing chicken broth with shredded poultry, root vegetables, and fresh dill.',
          tags: 'Comfort,Hearty',
          image: 'https://images.unsplash.com/photo-1588566565463-180a5b2090f2?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Beef soup',
          price: 150,
          description: 'Rich slow-cooked beef consommé with tender braised meat cubes and winter vegetables.',
          tags: 'Savory,Protein',
          image: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Tomato soup',
          price: 150,
          description: 'Velvety roasted tomato bisque finished with a swirl of cream and fresh basil leaves.',
          tags: 'Vegetarian,Classic',
          image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Carrot soup',
          price: 150,
          description: 'Sweet roasted garden carrots puréed with a touch of ginger and creamy coconut milk.',
          tags: 'Vegan,Warming',
          image: 'https://images.unsplash.com/photo-1603105037880-880cd4edfb0d?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Mushroom soup',
          price: 140,
          description: 'Earthy wild and button mushrooms simmered in creamy garlic stock with cracked pepper.',
          tags: 'Vegetarian,Earthy',
          image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Minestrone',
          price: 205,
          description: 'Hearty classic Italian vegetable medley with cannellini beans, ditalini pasta, and oregano.',
          tags: 'Vegetarian,Traditional',
          image: 'https://images.unsplash.com/photo-1603105037880-880cd4edfb0d?auto=format&fit=crop&w=800&q=80',
        },
      ],
    },
  ];

  for (const catData of categoriesData) {
    const { items, ...catDetails } = catData;
    const category = await prisma.category.upsert({
      where: { slug: catDetails.slug },
      update: catDetails,
      create: catDetails,
    });

    console.log(`📁 Category: ${category.name}`);

    let itemIndex = 0;
    for (const item of items) {
      itemIndex++;
      const existing = await prisma.menuItem.findFirst({
        where: {
          name: item.name,
          categoryId: category.id,
        },
      });

      if (existing) {
        await prisma.menuItem.update({
          where: { id: existing.id },
          data: {
            ...item,
            sortOrder: itemIndex,
          },
        });
      } else {
        await prisma.menuItem.create({
          data: {
            ...item,
            categoryId: category.id,
            sortOrder: itemIndex,
            isAvailable: true,
          },
        });
      }
    }
  }

  console.log('✅ Menu seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

