"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MercadoPagoService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const mercadopago_config_entity_1 = require("../entities/mercadopago-config.entity");
const user_entity_1 = require("../entities/user.entity");
let MercadoPagoService = class MercadoPagoService {
    constructor(configRepository, usersRepository) {
        this.configRepository = configRepository;
        this.usersRepository = usersRepository;
    }
    async getAdminUser() {
        const adminUser = await this.usersRepository.findOne({
            where: { role: user_entity_1.UserRole.ADMIN },
        });
        if (!adminUser) {
            throw new common_1.NotFoundException('Admin user not found');
        }
        return adminUser;
    }
    async findActiveConfig() {
        const adminUser = await this.getAdminUser();
        const config = await this.configRepository.findOne({
            where: { isActive: true, adminUser: { id: adminUser.id } },
            order: { createdAt: 'DESC' },
        });
        if (!config) {
            throw new common_1.NotFoundException('No Mercado Pago production keys have been configured yet');
        }
        return config;
    }
    async getAdminConfig() {
        const config = await this.findActiveConfig();
        return { accessToken: config.accessToken, publicKey: config.publicKey };
    }
    async getPublicConfig() {
        const config = await this.findActiveConfig();
        return { publicKey: config.publicKey };
    }
    async getAccessToken() {
        const config = await this.findActiveConfig();
        return config.accessToken;
    }
    async saveConfig(dto) {
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
};
exports.MercadoPagoService = MercadoPagoService;
exports.MercadoPagoService = MercadoPagoService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(mercadopago_config_entity_1.MercadoPagoConfig)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], MercadoPagoService);
//# sourceMappingURL=mercadopago.service.js.map