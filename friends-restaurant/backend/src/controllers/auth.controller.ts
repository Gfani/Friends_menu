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

  async updateProfile(request: FastifyRequest, reply: FastifyReply) {
    try {
      const user = request.user as { id: string; email: string; name: string };
      const { email, name, currentPassword, newPassword } = request.body as {
        email?: string;
        name?: string;
        currentPassword?: string;
        newPassword?: string;
      };

      const admin = await prisma.admin.findUnique({
        where: { id: user.id },
      });

      if (!admin) {
        return reply.status(404).send({
          success: false,
          error: 'Admin account not found',
        });
      }

      // If user wants to change password or email, require current password confirmation
      if (newPassword || (email && email.toLowerCase() !== admin.email.toLowerCase())) {
        if (!currentPassword) {
          return reply.status(400).send({
            success: false,
            error: 'Current password is required to change email or set a new password',
          });
        }

        const isCurrentValid = await bcrypt.compare(currentPassword, admin.password);
        if (!isCurrentValid) {
          return reply.status(401).send({
            success: false,
            error: 'Current password is incorrect',
          });
        }
      }

      const updateData: any = {};

      if (name && name.trim()) {
        updateData.name = name.trim();
      }

      if (email && email.trim()) {
        const normalizedEmail = email.trim().toLowerCase();
        if (normalizedEmail !== admin.email) {
          // Check if already in use
          const existing = await prisma.admin.findUnique({
            where: { email: normalizedEmail },
          });
          if (existing && existing.id !== admin.id) {
            return reply.status(400).send({
              success: false,
              error: 'This email address is already in use by another account',
            });
          }
          updateData.email = normalizedEmail;
        }
      }

      if (newPassword && newPassword.trim()) {
        if (newPassword.length < 6) {
          return reply.status(400).send({
            success: false,
            error: 'New password must be at least 6 characters long',
          });
        }
        updateData.password = await bcrypt.hash(newPassword, 10);
      }

      const updated = await prisma.admin.update({
        where: { id: admin.id },
        data: updateData,
        select: { id: true, email: true, name: true, updatedAt: true },
      });

      return reply.send({
        success: true,
        message: 'Account credentials updated successfully',
        admin: updated,
      });
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({
        success: false,
        error: error.message || 'Failed to update admin profile',
      });
    }
  }
}

export const authController = new AuthController();

