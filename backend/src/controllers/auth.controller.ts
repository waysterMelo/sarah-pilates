import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { 
  loginSchema, 
  registerSchema, 
  forgotPasswordSchema, 
  resetPasswordSchema,
  refreshTokenSchema,
  updateProfileSchema
} from '../schemas/auth.schema';

export class AuthController {
  static async login(req: Request, res: Response) {
    const { email, password } = loginSchema.parse(req.body);
    const result = await AuthService.login(email, password);
    res.json(result);
  }

  static async register(req: Request, res: Response) {
    const userData = registerSchema.parse(req.body);
    const result = await AuthService.register(userData);
    res.status(201).json(result);
  }

  static async refreshToken(req: Request, res: Response) {
    const { refreshToken } = refreshTokenSchema.parse(req.body);
    const result = await AuthService.refreshToken(refreshToken);
    res.json(result);
  }

  static async logout(req: Request, res: Response) {
    // In a real implementation, you might want to blacklist the token
    res.json({ message: 'Logout realizado com sucesso' });
  }

  static async forgotPassword(req: Request, res: Response) {
    const { email } = forgotPasswordSchema.parse(req.body);
    await AuthService.forgotPassword(email);
    res.json({ message: 'Email de recuperação enviado' });
  }

  static async resetPassword(req: Request, res: Response) {
    const { token, password } = resetPasswordSchema.parse(req.body);
    await AuthService.resetPassword(token, password);
    res.json({ message: 'Senha redefinida com sucesso' });
  }

  static async getProfile(req: Request, res: Response) {
    const user = await AuthService.getProfile(req.user.id);
    res.json(user);
  }

  static async updateProfile(req: Request, res: Response) {
    const updateData = updateProfileSchema.parse(req.body);
    const user = await AuthService.updateProfile(req.user.id, updateData);
    res.json(user);
  }
}