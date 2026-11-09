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

  // 2. Clear old items to ensure exact 29 items from screenshot
  await prisma.menuItem.deleteMany({});
  console.log('🧹 Purged previous items.');

  // 3. Categories & Items Data matching exact screenshot layout
  const categoriesData = [
    {
      name: 'Pasta',
      slug: 'pasta',
      description: 'Handcrafted Italian pasta simmered in authentic herbs and slow-cooked sauces.',
      icon: 'Soup',
      sortOrder: 1,
      items: [
        {
          name: 'Spaghetti Carbonara',
          price: 280,
          description: 'Authentic velvety egg emulsion, crispy cured meat crumbles, aged pecorino, and fresh crushed black pepper.',
          tags: 'Italian Classic,Chef Favorite',
          image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Spaghetti with Tomato',
          price: 230,
          description: 'San Marzano tomato coulis, cold-pressed virgin olive oil, sweet basil, and aged parmesan flakes.',
          tags: 'Pasta • Vegetarian',
          image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Spaghetti with Vegetable',
          price: 230,
          description: 'Sautéed zucchini, bell peppers, button mushrooms, garlic, and fresh Italian parsley.',
          tags: 'Pasta • Farm Harvest',
          image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281724?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Spaghetti with Meat',
          price: 270,
          description: 'Finely minced premium beef simmered slow in red wine reduction and aromatic mirepoix.',
          tags: 'Pasta • Prime Beef',
          image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Spaghetti with Bologna',
          price: 280,
          description: 'Classic northern Italian ragù alla Bolognese with herbs and rich crushed tomatoes.',
          tags: 'Pasta • Emilia Tradition',
          image: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Penne with Meat',
          price: 270,
          description: 'Ridged penne rigate capturing hearty seasoned minced beef in garlic tomato fond.',
          tags: 'Pasta • Classic Cut',
          image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Penne with Cream Sauce',
          price: 280,
          description: 'Rich garlic-infused dairy cream, roasted nutmeg hints, butter, and melted grana padano.',
          tags: 'Pasta • White Velvet',
          image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Lasagna Traditional',
          price: null,
          description: 'Layered pasta sheets, velvety béchamel sauce, mozzarella crust, and herbed tomato base.',
          tags: 'Baked Al Forno,Chef Special',
          image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Lasagna with Meat Sauce',
          price: null,
          description: 'Generous layers of slow-braised beef ragù, spiced ricotta, bubbling provolone, and parmesan.',
          tags: 'Baked Al Forno,Chef Special',
          image: 'https://images.unsplash.com/photo-1619895092538-128341789043?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Lasagna Carbonara',
          price: null,
          description: 'Artisan fusion of carbonara cream, crisp smoky bits, cracked pepper, and silken pasta strata.',
          tags: 'House Innovation,Chef Special',
          image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Artisan Telatelli',
          price: null,
          description: 'Handcrafted wide ribbon egg pasta tossed in cultured brown butter, wild herbs, and aged cheese.',
          tags: 'Hand Rolled Daily,Chef Special',
          image: 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?auto=format&fit=crop&w=800&q=80',
        },
      ],
    },
    {
      name: 'Rice',
      slug: 'rice',
      description: 'Fragrant basmati and pilaf selections infused with rich aromatic stocks and herbs.',
      icon: 'Utensils',
      sortOrder: 2,
      items: [
        {
          name: 'Rice with Chicken',
          price: 250,
          description: 'Golden seasoned fragrant pilaf rice paired with tender sliced roasted chicken fillet, garlic butter, and fresh cilantro.',
          tags: 'Hearty Platter,Popular',
          image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Vegetable Rice',
          price: 230,
          description: 'Wok-tossed seasoned basmati with sweet corn, shredded carrots, green beans, and scallions.',
          tags: 'Rice • Plant Based',
          image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Rice with Fish',
          price: 250,
          description: 'Pan-seared Nile perch fillet cubes served alongside herb-scented lemon butter rice.',
          tags: 'Rice • Catch of the Day',
          image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Rice with Meat',
          price: 245,
          description: 'Tender spiced beef strips sautéed with caramelised red onions over aromatic saffron rice.',
          tags: 'Rice • Savory Beef',
          image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
        },
      ],
    },
    {
      name: 'Salad',
      slug: 'salad',
      description: 'Handpicked crisp greens, garden vegetables, and chef-crafted signature dressings.',
      icon: 'Salad',
      sortOrder: 3,
      items: [
        {
          name: 'Special Salad',
          price: 280,
          description: 'Vibrant Mediterranean garden selection with butter avocado, heirloom cherry tomatoes, wild arugula, and citrus emulsion.',
          tags: 'Garden Crisp,Signature',
          image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Mixed Salad',
          price: 250,
          description: 'Assorted crisp leaf lettuce, purple cabbage, shaved cucumber, carrot ribbons, and lemon dressing.',
          tags: 'Salad • Garden Bowl',
          image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Tuna Salad',
          price: 230,
          description: 'Flaked yellowfin tuna tossed with capers, sweet red onion rings, hard-boiled egg, and herb vinaigrette.',
          tags: 'Salad • Protein Cold Dish',
          image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Chicken Salad',
          price: 305,
          description: 'Warm grilled rosemary chicken strips atop crisp romaine, rustic garlic croutons, and house aioli.',
          tags: 'Salad • Warm Grilled',
          image: 'https://images.unsplash.com/photo-1580013759032-c96505e24c1f?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Mayonnaise Salad',
          price: 280,
          description: 'Classic chilled diced potatoes, sweet baby peas, diced carrots enveloped in rich handcrafted mayonnaise.',
          tags: 'Salad • European Style',
          image: 'https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Avocado Salad',
          price: 230,
          description: 'Creamy ripe Hass avocado wedges, coriander leaves, lime zest, and extra virgin olive oil drizzle.',
          tags: 'Salad • Clean & Fresh',
          image: 'https://images.unsplash.com/photo-1529059997568-3d847b1154f0?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Tomato Salad',
          price: 230,
          description: 'Ripe vine-ripened tomatoes, sweet purple onions, oregano, and coarse sea salt on toasted focaccia crumbles.',
          tags: 'Salad • Simple Italian',
          image: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985b?auto=format&fit=crop&w=800&q=80',
        },
      ],
    },
    {
      name: 'Soup',
      slug: 'soup',
      description: 'Slow-simmered, warming broths served steaming with freshly baked artisan breadsticks.',
      icon: 'CupSoda',
      sortOrder: 4,
      items: [
        {
          name: 'Vegetable Soup',
          price: 150,
          description: 'Light restorative golden vegetable broth simmered with garden vegetables and fresh parsley oil.',
          tags: 'Soup • Gentle Starter',
          image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Chicken Soup',
          price: 230,
          description: 'Old-fashioned comforting chicken stock with pulled tender chicken, celery, carrots, and egg ribbons.',
          tags: 'Soup • Soul Food',
          image: 'https://images.unsplash.com/photo-1588566565463-180a5b2090f2?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Beef Soup',
          price: 150,
          description: 'Hearty roasted bone broth infused with thyme, root vegetables, and shredded beef shank.',
          tags: 'Soup • Deep Stock',
          image: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Tomato Soup',
          price: 150,
          description: 'Slow-roasted plum tomatoes blended velvety smooth with garlic confit and cream swirl.',
          tags: 'Soup • Bistro Favorite',
          image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Carrot Soup',
          price: 150,
          description: 'Sweet roasted organic carrots with a kiss of fresh ginger, turmeric, and coconut velvet finish.',
          tags: 'Soup • Warm Spiced',
          image: 'https://images.unsplash.com/photo-1603105037880-880cd4edfb0d?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Mushroom Soup',
          price: 140,
          description: 'Earthy sautéed button and cremini mushrooms blended in velvety cream with white truffle oil drop.',
          tags: 'Soup • Woodland Herb',
          image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Minestrone',
          price: 205,
          description: 'Thick rustic Italian potage of white cannellini beans, ditalini pasta, squash, and herb broth.',
          tags: 'Soup • Traditional Italian',
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

  console.log('✅ Menu seeding complete with exact restaurant card descriptions!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
