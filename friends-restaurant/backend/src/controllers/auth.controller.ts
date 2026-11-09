import { FastifyReply, FastifyRequest } from 'fastify';
import bcrypt from 'bcryptjs';
import { prisma } from '../config/database.js';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export class AuthController {
  async login(request: FastifyRequest, reply: FastifyReply) {
    try {
      const parseResult = loginSchema.safeParse(request.body);
      if (!parseResult.success) {
        return reply.status(400).send({
          success: false,
          error: parseResult.error.errors[0]?.message || 'Invalid login details',
        });
      }

      const { email, password } = parseResult.data;

      const admin = await prisma.admin.findUnique({
        where: { email: email.toLowerCase() },
      });

      if (!admin) {
        return reply.status(401).send({
          success: false,
          error: 'Invalid credentials. Please verify your email and password.',
        });
      }

      const isPasswordValid = await bcrypt.compare(password, admin.password);
      if (!isPasswordValid) {
        return reply.status(401).send({
          success: false,
          error: 'Invalid credentials. Please verify your email and password.',
        });
      }

      // Generate JWT
      const token = (request.server as any).jwt.sign(
        {
          id: admin.id,
          email: admin.email,
          name: admin.name,
        },
        { expiresIn: '7d' }
      );

      return reply.send({
        success: true,
        message: 'Welcome back to Central Perk Admin!',
        token,
        admin: {
          id: admin.id,
          email: admin.email,
          name: admin.name,
        },
      });
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({
        success: false,
        error: error.message || 'An error occurred during authentication',
      });
    }
  }

  async getMe(request: FastifyRequest, reply: FastifyReply) {
    try {
      const user = request.user as { id: string; email: string; name: string };
      const admin = await prisma.admin.findUnique({
        where: { id: user.id },
        select: { id: true, email: true, name: true, createdAt: true },
      });

      if (!admin) {
        return reply.status(404).send({
          success: false,
          error: 'Admin not found',
        });
      }

      return reply.send({
        success: true,
        admin,
      });
    } catch (error: any) {
      return reply.status(500).send({
        success: false,
        error: error.message,
      });
    }
  }
}

export const authController = new AuthController();

