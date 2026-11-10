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
      name: 'Manager',
    },
    create: {
      email: 'admin@friends.com',
      password: adminPassword,
      name: 'Manager',
    },
  });
  console.log(`👤 Admin ready: ${admin.email}`);

  // 2. Seed Default SiteSettings
  await prisma.siteSetting.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      restaurantName: 'MEREBA FRIENDS GARDEN',
      tagline: 'BISTRO • GARDEN • CASUAL LUXURY',
      heroTitle1: 'THE ONE WITH',
      heroTitle2: 'THE FOOD',
      heroDescription:
        'Good food, great company, and timeless memories. Browse our hand-rolled pastas, hearty pilafs, fresh garden bowls, and slow-simmered broths.',
      primaryCtaText: 'EXPLORE OUR MENU',
      secondaryCtaText: 'VISIT OUR GARDEN',

      wifiSsid: 'Mereba_Friends_Garden_5G',
      wifiPassword: 'centralperkcoffee',

      philosophyEyebrow: 'Our Philosophy',
      philosophyTitle: 'MORE THAN FOOD. IT’S ABOUT FRIENDSHIP.',
      philosophyDescription:
        'Central Perk meets modern boutique lounge. Designed as a sanctuary for heartfelt conversations, spontaneous laughter, and unforgettable comfort food in our garden.',
      manifestoQuote: 'Because Joey doesn’t share food, but we definitely think you should.',
      manifestoAuthor: 'The Kitchen Manifesto',

      galleryTitle: 'THE ONE WITH THE GOOD TIMES',
      galleryDescription:
        'A glimpse into our candlelit tables, laughter-filled dinners, and passionate artisan cooking in Mereba Friends Garden.',

      addressLine1: '17 ቀበሌ፣ ፊትለፊት በሰበርደ',
      addressLine2: 'ናይቀደም ገዛ ተጋሩ',
      openingHours: '11:00 AM – 11:00 PM',
      phone1: '0970700488',
      phone2: '0945986349',
      instagramHandle: '@MEREBA_FRIENDS_GARDEN',
      instagramUrl: 'https://www.instagram.com/mereba_friends_garden/',
      tiktokHandle: '@FRIENDS_GARDEN',
      tiktokUrl: 'https://www.tiktok.com/@friends_garden',
      facebookHandle: 'FB: FRIENDS GARDEN - መረባ ፍሬንድስ',
      facebookUrl:
        'https://www.facebook.com/search/top?q=FRIENDS%20GARDEN%20-%20%E1%88%98%E1%88%A8%E1%89%A3%20%E1%87%8D%E1%88%AC%E1%8A%95%E1%8B%95%E1%88%B5',

      accentColor: '#FFBD18',
      backgroundColor: '#050505',
      cardColor: '#121212',
      fontFamily: 'Plus Jakarta Sans',
    },
  });
  console.log('⚙️ Default Site Settings seeded.');

  // 3. Clear old items and categories for a clean slate
  await prisma.menuItem.deleteMany({});
  await prisma.category.deleteMany({});
  console.log('🧹 Purged previous items and categories.');

  // 4. Two Main Groups: FOOD and DRINKS
  const categoriesData = [
    // --- FOOD CATEGORIES ---
    {
      name: 'Tibs & Ethiopian Specials',
      slug: 'tibs-ethiopian',
      parentCategory: 'FOOD',
      description: 'Sizzling Ethiopian specialties prepared with fresh farm herbs, aromatic berbere, and injera.',
      sortOrder: 1,
      items: [
        {
          name: 'Sizzling Beef Tibs with Rice',
          price: 320,
          description: 'Tender cubed beef sizzling with rosemary, jalapeños, onions, served over savory spiced rice with boiled farm egg and injera.',
          tags: 'House Special,Chef Signature',
          image: '/assets/real/friends-tibs-rice.jpg',
        },
        {
          name: 'Dereq Tibs with Awaze',
          price: 340,
          description: 'Crispy pan-fried beef cubes tossed with rosemary, garlic butter, and served with spicy house awaze and fresh injera.',
          tags: 'Authentic,Sizzling',
          image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
        },
      ],
    },
    {
      name: 'Pizza',
      slug: 'pizza',
      parentCategory: 'FOOD',
      description: 'Hand-stretched dough stone-baked to golden perfection with rich mozzarella and house marinara.',
      sortOrder: 2,
      items: [
        {
          name: 'The Joey Special Folded Pizza Platter',
          price: 380,
          description: 'Signature golden baked folded calzone-style pizza with rich meat, melted mozzarella, crispy french fries, house dips & ketchup Friends art.',
          tags: 'Joey Favorite,House Special',
          image: '/assets/real/friends-special-pizza.jpg',
        },
        {
          name: 'Central Perk Margherita Pizza',
          price: 280,
          description: 'San Marzano tomato base, creamy whole milk mozzarella, cold-pressed olive oil, and sweet basil leaves.',
          tags: 'Classic,Vegetarian',
          image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=800&q=80',
        },
      ],
    },
    {
      name: 'Burger',
      slug: 'burger',
      parentCategory: 'FOOD',
      description: 'Gourmet smashed and grilled patties served on artisan toasted brioche buns with crispy fries.',
      sortOrder: 3,
      items: [
        {
          name: 'Central Perk Classic Beef Burger',
          price: 290,
          description: 'Prime ground beef patty, melted cheddar, garden lettuce, ripe tomato, house pickle relish, served with hot golden fries.',
          tags: 'Gourmet,Bestseller',
          image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: "Joey's Double Cheese Smashed Burger",
          price: 360,
          description: 'Two smashed prime beef patties, double smoked cheddar, caramelized onions, secret sauce on buttery brioche.',
          tags: 'Hearty,Chef Pick',
          image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80',
        },
      ],
    },
    {
      name: 'Pasta',
      slug: 'pasta',
      parentCategory: 'FOOD',
      description: 'Handcrafted Italian pasta simmered in authentic herbs and slow-cooked sauces.',
      sortOrder: 4,
      items: [
        {
          name: 'Spaghetti Carbonara',
          price: 280,
          description: 'Velvety egg yolk emulsion, cured beef bacon, aged pecorino cheese, and fresh crushed black pepper.',
          tags: 'Signature,Italian Classic',
          image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Spaghetti with Tomato',
          price: 230,
          description: 'San Marzano tomato coulis, virgin olive oil, sweet basil, and parmesan flakes.',
          tags: 'Vegetarian',
          image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Spaghetti with Vegetable',
          price: 230,
          description: 'Sautéed zucchini, bell peppers, button mushrooms, garlic, and fresh Italian parsley.',
          tags: 'Farm Harvest',
          image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281724?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Spaghetti with Meat',
          price: 270,
          description: 'Slow-simmered minced beef in aromatic red wine and garlic tomato reduction.',
          tags: 'Prime Beef',
          image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Spaghetti with Bologna',
          price: 280,
          description: 'Classic northern Italian ragù alla Bolognese with herbs and crushed tomatoes.',
          tags: 'Emilia Tradition',
          image: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Penne with Meat',
          price: 270,
          description: 'Penne rigate capturing seasoned ground beef in rich tomato fond.',
          tags: 'Classic Cut',
          image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Penne with Cream Sauce',
          price: 280,
          description: 'Garlic-infused dairy cream, roasted nutmeg hints, butter, and melted grana padano.',
          tags: 'White Velvet',
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
          description: 'Generous layers of slow-braised beef ragù, spiced ricotta, and bubbling mozzarella.',
          tags: 'Baked Al Forno,Chef Special',
          image: 'https://images.unsplash.com/photo-1619895092538-128341789043?auto=format&fit=crop&w=800&q=80',
        },
      ],
    },
    {
      name: 'Rice',
      slug: 'rice',
      parentCategory: 'FOOD',
      description: 'Fragrant aromatic long-grain pilafs tossed with spices, veggies, and succulent proteins.',
      sortOrder: 5,
      items: [
        {
          name: 'Rice with Chicken',
          price: 250,
          description: 'Golden spiced long-grain rice infused with saffron, diced carrots, and tender seared chicken breast fillets.',
          tags: 'Popular,High Protein',
          image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Vegetable Rice',
          price: 230,
          description: 'Aromatic basmati rice tossed with garden sweet peas, sweet corn, carrots, bell peppers, and scallions.',
          tags: 'Garden Fresh,Vegan',
          image: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Rice with Fish',
          price: 250,
          description: 'Pan-seared Nile perch fillet gently flaked over spiced herb pilaf with lemon butter glaze.',
          tags: 'Catch of the Day,Omega-3',
          image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Rice with Meat',
          price: 245,
          description: 'Savory sautéed beef strips, caramelized red onions, roasted cumin, and long-grain rice.',
          tags: 'Prime Beef,Hearty',
          image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80',
        },
      ],
    },
    {
      name: 'Salad',
      slug: 'salad',
      parentCategory: 'FOOD',
      description: 'Crisp hand-picked organic leaves, fresh garden dressings, and artisan toppings.',
      sortOrder: 6,
      items: [
        {
          name: 'Mereba Garden Family Feast Salad',
          price: 290,
          description: 'Crisp garden iceberg lettuce, shaved carrots, fresh sliced lime, diced tomatoes, dressed in house vinaigrette.',
          tags: 'Garden Signature,Fresh Pick',
          image: '/assets/real/friends-garden-feast.jpg',
        },
        {
          name: 'Special Salad',
          price: 280,
          description: 'Mixed garden greens, chunk light tuna, farm-boiled eggs, sweet corn, kalamata olives, and house herb dressing.',
          tags: 'Signature,Chef Pick',
          image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Mixed Salad',
          price: 250,
          description: 'Crisp romaine, shredded purple cabbage, cucumber coins, cherry tomatoes, and cold-pressed virgin olive oil.',
          tags: 'Crisp Greens,Low Cal',
          image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Tuna Salad',
          price: 230,
          description: 'Flaked tuna, capers, diced red onions, crisp celery, and light lemon-herb vinaigrette.',
          tags: 'Seafood,High Protein',
          image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Chicken Salad',
          price: 305,
          description: 'Grilled herb chicken breast slices, mixed leaves, toasted croutons, and creamy house dressing.',
          tags: 'Gourmet,Favorite',
          image: 'https://images.unsplash.com/photo-1580013759032-c96505e24c1f?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Mayonnaise Salad',
          price: 280,
          description: 'Tender diced potatoes, carrots, green peas, and boiled egg folded in creamy velvet mayonnaise.',
          tags: 'Creamy Classic,Comfort',
          image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Avocado Salad',
          price: 230,
          description: 'Ripe sliced Ethiopian avocado, plum tomatoes, red onion rings, fresh lime juice, and sea salt.',
          tags: 'Superfood,Healthy',
          image: 'https://images.unsplash.com/photo-1529059997568-3d847b1154f0?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Tomato Salad',
          price: 230,
          description: 'Vine-ripened local tomatoes, thin red onions, spicy green chilies, and virgin olive oil.',
          tags: 'Zesty,Fresh',
          image: 'https://images.unsplash.com/photo-1592417817098-8f3d69109853?auto=format&fit=crop&w=800&q=80',
        },
      ],
    },
    {
      name: 'Soup',
      slug: 'soup',
      parentCategory: 'FOOD',
      description: 'Slow-simmered nourishing broths made daily from scratch with aromatic garden herbs.',
      sortOrder: 7,
      items: [
        {
          name: 'Vegetable Soup',
          price: 150,
          description: 'Hearty simmered seasonal garden vegetables in clear herbal broth with aromatic celery.',
          tags: 'Comfort,Vegan',
          image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Chicken Soup',
          price: 230,
          description: 'Slow-poached country chicken, diced root vegetables, cracked black pepper, and warm aromatic broth.',
          tags: 'Warm Broth,Soul Food',
          image: 'https://images.unsplash.com/photo-1603105037880-880cd4edfb0d?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Beef Soup',
          price: 150,
          description: 'Tender braised beef shanks, potatoes, and garlic in rich caramelized beef bouillon.',
          tags: 'Rich Bouillon,Protein',
          image: 'https://images.unsplash.com/photo-1578873375969-d652136e4f3a?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Tomato Soup',
          price: 150,
          description: 'Roasted plum tomatoes, fresh sweet basil puree, a splash of dairy cream, and roasted garlic.',
          tags: 'Roasted Basil,Smooth',
          image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Carrot Soup',
          price: 150,
          description: 'Velvety puréed sweet highland carrots, roasted ginger warmth, and toasted cumin seeds.',
          tags: 'Velvet Purée,Healthy',
          image: 'https://images.unsplash.com/photo-1605698802004-945fa64c0587?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Mushroom Soup',
          price: 140,
          description: 'Earthy sautéed button mushrooms, fresh thyme, butter, cream, and vegetable stock.',
          tags: 'Earthy Wild,Creamy',
          image: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Minestrone',
          price: 205,
          description: 'Classic Italian thick vegetable stew with ditalini pasta, cannellini beans, and grated parmesan.',
          tags: 'Italian Rustic,Wholesome',
          image: 'https://images.unsplash.com/photo-1608797178974-15b35a61dd78?auto=format&fit=crop&w=800&q=80',
        },
      ],
    },

    // --- DRINKS CATEGORIES ---
    {
      name: 'Mojito & Mocktails',
      slug: 'mojito-mocktails',
      parentCategory: 'DRINKS',
      description: 'Crafted with fresh muddled mint, garden citrus, crushed ice, and sparkling effervescence.',
      sortOrder: 8,
      items: [
        {
          name: 'Classic Garden Lime Mojito',
          price: 160,
          description: 'Fresh garden muddled lime wheels, aromatic mint sprigs, sparkling soda, and pure cane sugar in a Central Perk mason jar.',
          tags: 'Signature,Mason Jar',
          image: '/assets/real/friends-mojito-jars.jpg',
        },
        {
          name: 'Strawberry Bliss Mojito',
          price: 180,
          description: 'Crushed ripe strawberries, fresh lime wedges, garden mint, and chilled sparkling club soda.',
          tags: 'Berry Fizz,Refreshing',
          image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Passionfruit Island Mocktail',
          price: 190,
          description: 'Tropical passionfruit nectar, fresh lemon zest, mint, and effervescent tonic on crushed ice.',
          tags: 'Tropical,Exotic',
          image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
        },
      ],
    },
    {
      name: 'Alcohol & Draft Beers',
      slug: 'alcohol-beer',
      parentCategory: 'DRINKS',
      description: 'Chilled draft beers in heavy glass mugs, local craft brews, and selected table wines.',
      sortOrder: 9,
      items: [
        {
          name: 'St. George Draft Beer Mug',
          price: 110,
          description: 'Ice-cold draft beer in a heavy glass beer mug with crisp white foam head, perfect for the couch lounge vibe.',
          tags: 'Draft Beer,Chilled Mug',
          image: '/assets/real/friends-vibe-couch.jpg',
        },
        {
          name: 'Bedele Special Premium Lager',
          price: 120,
          description: 'Cold Ethiopian premium bottled beer brewed with finest golden malted barley.',
          tags: 'Premium Lager,Ice Cold',
          image: 'https://images.unsplash.com/photo-1608270191763-7c37f2ff6265?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'House Red Wine Glass',
          price: 220,
          description: 'Velvety dry red wine with ripe berry notes and smooth finish.',
          tags: 'Wine,Evening Lounge',
          image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80',
        },
      ],
    },
    {
      name: 'Juice & Smoothies',
      slug: 'juice-smoothies',
      parentCategory: 'DRINKS',
      description: 'Pure 100% freshly pressed Ethiopian fruits, vitamin-rich and prepared à la minute.',
      sortOrder: 10,
      items: [
        {
          name: 'Fresh Mango Juice',
          price: 140,
          description: 'Pure ripe seasonal mango blended velvety smooth without added preservatives.',
          tags: '100% Pure,Vitamin C',
          image: 'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Avocado Special Smoothie',
          price: 150,
          description: 'Thick creamy Hass avocado layered with fresh lime squeeze and pure highland honey.',
          tags: 'Creamy Rich,Superfood',
          image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Spris (Layered Trio Juice)',
          price: 160,
          description: 'Traditional Ethiopian layered juice: ripe papaya, mango, and avocado in three colorful natural tiers.',
          tags: 'Layered Trio,House Favorite',
          image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=800&q=80',
        },
      ],
    },
    {
      name: 'Cold Drinks & Soft Drinks',
      slug: 'cold-drinks',
      parentCategory: 'DRINKS',
      description: 'Refreshing carbonated soft drinks, sparkling mineral waters, and chilled iced teas.',
      sortOrder: 11,
      items: [
        {
          name: 'Central Perk Iced Mason Jar Soda',
          price: 70,
          description: 'Ice-cold Coca-Cola, Sprite, or Fanta served over crushed ice in an authentic glass mason jar with retro striped straw.',
          tags: 'Mason Jar,Ice Cold',
          image: '/assets/real/friends-mojito-jars.jpg',
        },
        {
          name: 'Ambo Sparkling Mineral Water',
          price: 50,
          description: 'Naturally sparkling Ethiopian volcanic mineral water served chilled with fresh lime wedge.',
          tags: 'Natural Sparkling',
          image: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=800&q=80',
        },
      ],
    },
    {
      name: 'Hot Drinks & Coffee',
      slug: 'hot-drinks-coffee',
      parentCategory: 'DRINKS',
      description: 'Central Perk roasts, traditional clay pot jebena brews, and silky steamed macchiatos.',
      sortOrder: 12,
      items: [
        {
          name: 'Authentic Ethiopian Macchiato',
          price: 60,
          description: 'Rich dark espresso roast layered with velvety steamed milk foam in a classic glass cup.',
          tags: 'Bestseller,Espresso Roast',
          image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Traditional Clay Pot Jebena Coffee',
          price: 50,
          description: 'Freshly roasted Ethiopian highland coffee beans brewed traditionally in clay jebena with aromatic frankincense smoke.',
          tags: 'Heritage,Clay Jebena',
          image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Central Perk Cappuccino',
          price: 90,
          description: 'Double espresso topped with thick creamy microfoam and dusting of raw Dutch cocoa powder.',
          tags: 'Central Perk,Comfort Mug',
          image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=800&q=80',
        },
      ],
    },
  ];

  let totalItemsCount = 0;
  for (const catData of categoriesData) {
    const { items, ...catDetails } = catData;
    const category = await prisma.category.create({
      data: catDetails,
    });

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      await prisma.menuItem.create({
        data: {
          name: item.name,
          price: item.price,
          description: item.description,
          tags: item.tags,
          image: item.image,
          categoryId: category.id,
          sortOrder: i,
          isAvailable: true,
        },
      });
      totalItemsCount++;
    }
  }

  console.log(`✅ Seeded ${categoriesData.length} categories across FOOD and DRINKS with ${totalItemsCount} menu items!`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
