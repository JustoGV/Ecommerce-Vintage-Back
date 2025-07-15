import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    console.log(user,'userr')
    if (!user || user.password !== password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { password: _, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      message: 'Login successful'
    };
  }

  async register(userData: any) {
    const user = await this.usersService.create(userData);
    const { password, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      message: 'Registration successful'
    };
  }

  async validateUser(email: string, password: string): Promise<any> {
    // Busca el usuario por email
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;
    // Compara la contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;
    // Opcional: puedes devolver el usuario sin la contraseña
    const { password: _, ...result } = user;
    return result;
  }
}