import prisma from '../config/database';
import { hashPassword, comparePassword } from '../utils/bcrypt';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../config/auth';
import { EmailService } from './email.service';

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: 'ADMIN' | 'INSTRUCTOR' | 'RECEPTIONIST';
}

interface UpdateProfileData {
  name?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}

export class AuthService {
  static async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { instructor: true }
    });

    if (!user || !user.isActive) {
      throw new Error('Credenciais inválidas');
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Credenciais inválidas');
    }

    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        instructor: user.instructor
      },
      accessToken,
      refreshToken
    };
  }

  static async register(data: RegisterData) {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (existingUser) {
      throw new Error('Email já está em uso');
    }

    const hashedPassword = await hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role || 'INSTRUCTOR'
      }
    });

    // If role is INSTRUCTOR, create instructor record
    if (user.role === 'INSTRUCTOR') {
      await prisma.instructor.create({
        data: {
          userId: user.id,
          specialties: []
        }
      });
    }

    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      accessToken,
      refreshToken
    };
  }

  static async refreshToken(refreshToken: string) {
    try {
      const decoded = verifyRefreshToken(refreshToken);
      
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        include: { instructor: true }
      });

      if (!user || !user.isActive) {
        throw new Error('Usuário inválido');
      }

      const payload = {
        userId: user.id,
        email: user.email,
        role: user.role
      };

      const newAccessToken = generateAccessToken(payload);
      const newRefreshToken = generateRefreshToken(payload);

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      };
    } catch (error) {
      throw new Error('Refresh token inválido');
    }
  }

  static async forgotPassword(email: string) {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      // Don't reveal if email exists
      return;
    }

    const resetToken = generateAccessToken(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      '1h'
    );

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    
    await EmailService.sendPasswordReset(user.name, user.email, resetLink);
  }

  static async resetPassword(token: string, newPassword: string) {
    try {
      const decoded = verifyRefreshToken(token);
      
      const hashedPassword = await hashPassword(newPassword);
      
      await prisma.user.update({
        where: { id: decoded.userId },
        data: { password: hashedPassword }
      });
    } catch (error) {
      throw new Error('Token inválido ou expirado');
    }
  }

  static async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { instructor: true },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        instructor: true
      }
    });

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    return user;
  }

  static async updateProfile(userId: string, data: UpdateProfileData) {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    // Verify current password if changing password
    if (data.newPassword && data.currentPassword) {
      const isCurrentPasswordValid = await comparePassword(data.currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        throw new Error('Senha atual incorreta');
      }
    }

    const updateData: any = {};
    
    if (data.name) updateData.name = data.name;
    if (data.email) updateData.email = data.email;
    if (data.newPassword) updateData.password = await hashPassword(data.newPassword);

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      include: { instructor: true },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        instructor: true
      }
    });

    return updatedUser;
  }
}