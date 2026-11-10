export type Language = 'en' | 'ti' | 'am';

export interface Translations {
  home: string;
  ourMenu: string;
  aboutUs: string;
  atmosphere: string;
  locationHours: string;
  freeWifi: string;
  guestWifi: string;
  copyPassword: string;
  passwordCopied: string;
  close: string;
  exploreMenu: string;
  visitGarden: string;
  food: string;
  drinks: string;
  allFood: string;
  allDrinks: string;
  searchPlaceholderFood: string;
  searchPlaceholderDrinks: string;
  clearSearch: string;
  dishes: string;
  items: string;
  address: string;
  diningHours: string;
  kitchenCloses: string;
  contactSocial: string;
  backToTop: string;
  chefSpecial: string;
  houseSpecial: string;
  dailyOpen: string;
  artisanDishes: string;
  freshToOrder: string;
  philosophyEyebrow: string;
  atmosphereEyebrow: string;
  noDishesFound: string;
  trySearching: string;
  showAll: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    home: 'Home',
    ourMenu: 'Our Menu',
    aboutUs: 'About Us',
    atmosphere: 'Atmosphere',
    locationHours: 'Location & Hours',
    freeWifi: 'Free Wi-Fi',
    guestWifi: 'Complimentary Guest Wi-Fi',
    copyPassword: 'Copy Password',
    passwordCopied: 'Password Copied!',
    close: 'Close',
    exploreMenu: 'EXPLORE OUR MENU',
    visitGarden: 'VISIT OUR GARDEN',
    food: 'FOOD',
    drinks: 'DRINKS',
    allFood: 'All Food',
    allDrinks: 'All Drinks',
    searchPlaceholderFood: 'Search pasta, rice, salad, soup, pizza...',
    searchPlaceholderDrinks: 'Search soft drinks, mojito, beer, juice...',
    clearSearch: 'Clear Search',
    dishes: 'dishes',
    items: 'items',
    address: 'Our Address',
    diningHours: 'Dining Hours',
    kitchenCloses: 'Kitchen closes 10:30 PM',
    contactSocial: 'Contact & Social',
    backToTop: 'Back to Top',
    chefSpecial: "Chef's Special",
    houseSpecial: 'House Special',
    dailyOpen: 'AM • Daily Open',
    artisanDishes: 'Artisan Dishes & Drinks',
    freshToOrder: 'Fresh To Order',
    philosophyEyebrow: 'Our Philosophy',
    atmosphereEyebrow: 'Atmosphere & Plates • Real Moments',
    noDishesFound: 'No dishes or drinks match your selection.',
    trySearching: 'Try selecting "All" or clear your search term.',
    showAll: 'Show All',
  },
  ti: {
    home: 'መእተዊ',
    ourMenu: 'ዝርዝር መግቢ',
    aboutUs: 'ብዛዕባና',
    atmosphere: 'ከባቢና',
    locationHours: 'ቦታን ሰዓታትን',
    freeWifi: 'ናጻ ዋይፋይ',
    guestWifi: 'ናጻ ናይ ጋሻ ዋይፋይ',
    copyPassword: 'ፓስዎርድ ቅዳሕ',
    passwordCopied: 'ተቀዲሑ!',
    close: 'ዕጾ',
    exploreMenu: 'ዝርዝር መግቢ ርአ',
    visitGarden: 'ናብ ገነትና ምጹ',
    food: 'መግቢ',
    drinks: 'መስተታት',
    allFood: 'ኩሉ መግቢ',
    allDrinks: 'ኩሉ መስተታት',
    searchPlaceholderFood: 'ፓስታ፣ ሩዝ፣ ሰላጣ፣ ሾርባ፣ ፒዛ ድለይ...',
    searchPlaceholderDrinks: 'ለስላሳ፣ ሞሂቶ፣ ቢራ፣ ጁስ ድለይ...',
    clearSearch: 'ድለይ ሰርዝ',
    dishes: 'ዓይነታት መግቢ',
    items: 'ዓይነታት',
    address: 'አድራሻና',
    diningHours: 'ናይ መግቢ ሰዓታት',
    kitchenCloses: 'ክሽነ ሰዓት 4:30 ናይ ለይቲ ይዕጾ',
    contactSocial: 'ርክብን ማሕበራዊ ሚድያን',
    backToTop: 'ናብ ላዕሊ ተመለስ',
    chefSpecial: 'ናይ ሼፍ ፍሉይ',
    houseSpecial: 'ፍሉይ መግቢ',
    dailyOpen: 'ቅ.ቀ • መዓልታዊ ክፉት',
    artisanDishes: 'ዝተመረጹ መግብታትን መስተታትን',
    freshToOrder: '100% ሓድሽ ዝስራሕ',
    philosophyEyebrow: 'ፍልስፍናና',
    atmosphereEyebrow: 'ከባቢናን መኣድናን • ናይ ብሓቂ ዝተሳእለ',
    noDishesFound: 'ዝተረኽበ መግቢ ወይ መስተ የለን።',
    trySearching: 'ኩሉ ዝብል ምረጽ ወይ ድለይ ቀይር።',
    showAll: 'ኩሉ ኣርእይ',
  },
  am: {
    home: 'መነሻ',
    ourMenu: 'የምግብ ዝርዝር',
    aboutUs: 'ስለ እኛ',
    atmosphere: 'ከባቢያችን',
    locationHours: 'አድራሻና የስራ ሰዓት',
    freeWifi: 'ነጻ ዋይፋይ',
    guestWifi: 'ነጻ የእንግዳ ዋይፋይ',
    copyPassword: 'የይለፍ ቃል ቅዳ',
    passwordCopied: 'ተቀድቷል!',
    close: 'ዝጋ',
    exploreMenu: 'የምግብ ዝርዝር ይመልከቱ',
    visitGarden: 'ወደ ስፍራችን ይምጡ',
    food: 'ምግብ',
    drinks: 'መጠጦች',
    allFood: 'ሁሉም ምግቦች',
    allDrinks: 'ሁሉም መጠጦች',
    searchPlaceholderFood: 'ፓስታ፣ ሩዝ፣ ሰላጣ፣ ሾርባ፣ ፒዛ ፈልግ...',
    searchPlaceholderDrinks: 'ለስላሳ፣ ሞሂቶ፣ ቢራ፣ ጁስ ፈልግ...',
    clearSearch: 'ፍለጋ ሰርዝ',
    dishes: 'የምግብ አይነቶች',
    items: 'አይነቶች',
    address: 'አድራሻችን',
    diningHours: 'የምግብ ሰዓታት',
    kitchenCloses: 'ማብሰያው 4:30 ይዘጋል',
    contactSocial: 'አድራሻና ማህበራዊ ሚዲያ',
    backToTop: 'ወደ ላይ ተመለስ',
    chefSpecial: 'የሼፉ ልዩ',
    houseSpecial: 'የቤቱ ልዩ',
    dailyOpen: 'ጥዋት • በየቀኑ ክፍት',
    artisanDishes: 'ምርጥ ምግቦችና መጠጦች',
    freshToOrder: '100% ትኩስ ሆኖ የሚዘጋጅ',
    philosophyEyebrow: 'ፍልስፍናችን',
    atmosphereEyebrow: 'ከባቢያችንና ገበታችን • ትክክለኛ ምስሎች',
    noDishesFound: 'የተገኘ ምግብ ወይም መጠጥ የለም።',
    trySearching: 'ሁሉንም የሚለውን ይምረጡ ወይም ፍለጋውን ያጽዱ።',
    showAll: 'ሁሉንም አሳይ',
  },
};

// Translate Category names dynamically
export const translateCategory = (name: string, lang: Language): string => {
  if (lang === 'en') return name;

  const upper = name.toUpperCase();

  if (lang === 'ti') {
    if (upper.includes('PASTA')) return 'ፓስታ';
    if (upper.includes('RICE')) return 'ሩዝ';
    if (upper.includes('SALAD')) return 'ሰላጣ';
    if (upper.includes('SOUP')) return 'ሾርባ';
    if (upper.includes('BURGER')) return 'በርገር';
    if (upper.includes('PIZZA')) return 'ፒዛ';
    if (upper.includes('TIBS')) return 'ጥብሲ ፍሉይ መግቢ';
    if (upper.includes('MOJITO')) return 'ሞሂቶን ሞክቴልን';
    if (upper.includes('ALCOHOL') || upper.includes('BEER')) return 'ድራፍት ቢራን መስተን';
    if (upper.includes('JUICE')) return 'ፍሩሽ ጁስ';
    if (upper.includes('COLD') || upper.includes('SOFT')) return 'ዝሑል ለስላሳታት';
    if (upper.includes('HOT') || upper.includes('COFFEE')) return 'ቡንን ሙቁል መስተን';
  }

  if (lang === 'am') {
    if (upper.includes('PASTA')) return 'ፓስታ';
    if (upper.includes('RICE')) return 'ሩዝ';
    if (upper.includes('SALAD')) return 'ሰላጣ';
    if (upper.includes('SOUP')) return 'ሾርባ';
    if (upper.includes('BURGER')) return 'በርገር';
    if (upper.includes('PIZZA')) return 'ፒዛ';
    if (upper.includes('TIBS')) return 'ጥብስ እና የሀበሻ ልዩ';
    if (upper.includes('MOJITO')) return 'ሞሂቶ እና ሞክቴል';
    if (upper.includes('ALCOHOL') || upper.includes('BEER')) return 'ድራፍት ቢራ እና መጠጦች';
    if (upper.includes('JUICE')) return 'ትኩስ ጭማቂ';
    if (upper.includes('COLD') || upper.includes('SOFT')) return 'ቀዝቃዛ ለስላሳዎች';
    if (upper.includes('HOT') || upper.includes('COFFEE')) return 'ቡና እና ትኩስ መጠጦች';
  }

  return name;
};
