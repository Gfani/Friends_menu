import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../config/database.js';

const DEFAULT_SETTINGS = {
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
};

export class SettingsController {
  async getSettings(request: FastifyRequest, reply: FastifyReply) {
    try {
      let settings = await prisma.siteSetting.findUnique({
        where: { id: 'default' },
      });

      if (!settings) {
        settings = await prisma.siteSetting.create({
          data: {
            id: 'default',
            ...DEFAULT_SETTINGS,
          },
        });
      }

      return reply.send({
        success: true,
        data: settings,
      });
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({
        success: false,
        error: error.message || 'Failed to fetch site settings',
      });
    }
  }

  async updateSettings(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = request.body as Record<string, any>;
      // Remove id from body if present
      delete body.id;
      delete body.updatedAt;

      const updated = await prisma.siteSetting.upsert({
        where: { id: 'default' },
        create: {
          id: 'default',
          ...DEFAULT_SETTINGS,
          ...body,
        },
        update: {
          ...body,
        },
      });

      return reply.send({
        success: true,
        message: 'Settings updated successfully',
        data: updated,
      });
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({
        success: false,
        error: error.message || 'Failed to update settings',
      });
    }
  }

  async resetSettings(request: FastifyRequest, reply: FastifyReply) {
    try {
      const reset = await prisma.siteSetting.upsert({
        where: { id: 'default' },
        create: {
          id: 'default',
          ...DEFAULT_SETTINGS,
        },
        update: {
          ...DEFAULT_SETTINGS,
        },
      });

      return reply.send({
        success: true,
        message: 'Site settings restored to default successfully',
        data: reset,
      });
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({
        success: false,
        error: error.message || 'Failed to restore default settings',
      });
    }
  }
}

export const settingsController = new SettingsController();

