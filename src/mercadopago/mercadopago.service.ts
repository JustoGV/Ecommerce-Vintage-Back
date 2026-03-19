import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MercadoPagoConfig } from '../entities/mercadopago-config.entity';
import { User, UserRole } from '../entities/user.entity';
import { UpdateMercadoPagoConfigDto } from './dto/update-mercadopago-config.dto';

@Injectable()
export class MercadoPagoService {
  constructor(
    @InjectRepository(MercadoPagoConfig)
    private readonly configRepository: Repository<MercadoPagoConfig>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  private async getAdminUser(): Promise<User> {
    const adminUser = await this.usersRepository.findOne({
      where: { role: UserRole.ADMIN },
    });

    if (!adminUser) {
      throw new NotFoundException('Admin user not found');
    }

    return adminUser;
  }

  private async findActiveConfig(): Promise<MercadoPagoConfig> {
    const adminUser = await this.getAdminUser();
    const config = await this.configRepository.findOne({
      where: { isActive: true, adminUser: { id: adminUser.id } },
      order: { createdAt: 'DESC' },
    });

    if (!config) {
      throw new NotFoundException(
        'No Mercado Pago production keys have been configured yet',
      );
    }

    return config;
  }

  async getAdminConfig(): Promise<{ accessToken: string; publicKey: string }> {
    const config = await this.findActiveConfig();
    return { accessToken: config.accessToken, publicKey: config.publicKey };
  }

  async getPublicConfig(): Promise<{ publicKey: string }> {
    const config = await this.findActiveConfig();
    return { publicKey: config.publicKey };
  }

  async getAccessToken(): Promise<string> {
    const config = await this.findActiveConfig();
    return config.accessToken;
  }

  async saveConfig(
    dto: UpdateMercadoPagoConfigDto,
  ): Promise<{ accessToken: string; publicKey: string }> {
    const adminUser = await this.getAdminUser();
    const existing = await this.configRepository.findOne({
      where: { isActive: true, adminUser: { id: adminUser.id } },
      order: { createdAt: 'DESC' },
    });

    if (existing) {
      existing.accessToken = dto.accessToken;
      existing.publicKey = dto.publicKey;
      existing.adminUser = adminUser;
      const saved = await this.configRepository.save(existing);
      return { accessToken: saved.accessToken, publicKey: saved.publicKey };
    }

    const created = this.configRepository.create({
      accessToken: dto.accessToken,
      publicKey: dto.publicKey,
      isActive: true,
      adminUser,
    });
    const saved = await this.configRepository.save(created);
    return { accessToken: saved.accessToken, publicKey: saved.publicKey };
  }
}
