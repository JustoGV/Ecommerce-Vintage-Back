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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckoutService = void 0;
const common_1 = require("@nestjs/common");
const mercadopago_service_1 = require("../mercadopago/mercadopago.service");
let CheckoutService = class CheckoutService {
    constructor(mercadoPagoService) {
        this.mercadoPagoService = mercadoPagoService;
    }
    async createPreference(dto) {
        const accessToken = await this.mercadoPagoService.getAccessToken();
        const payload = {
            items: dto.items.map((item) => ({
                title: item.title,
                quantity: item.quantity,
                unit_price: item.unitPrice,
                currency_id: item.currencyId || 'ARS',
                description: item.description,
                picture_url: item.pictureUrl,
            })),
        };
        if (dto.payer) {
            payload.payer = dto.payer;
        }
        if (dto.externalReference) {
            payload.external_reference = dto.externalReference;
        }
        if (dto.notificationUrl) {
            payload.notification_url = dto.notificationUrl;
        }
        const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });
        if (!response.ok) {
            const errorBody = await response.text();
            throw new common_1.InternalServerErrorException(`Mercado Pago error: ${response.status} ${errorBody}`);
        }
        const data = (await response.json());
        return {
            id: data.id,
            url: data.init_point || data.sandbox_init_point,
        };
    }
};
exports.CheckoutService = CheckoutService;
exports.CheckoutService = CheckoutService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mercadopago_service_1.MercadoPagoService])
], CheckoutService);
//# sourceMappingURL=checkout.service.js.map