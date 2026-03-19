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
exports.MercadoPagoWebhooksController = void 0;
const common_1 = require("@nestjs/common");
const mercadopago_service_1 = require("../mercadopago/mercadopago.service");
const typeorm_1 = require("@nestjs/typeorm");
const checkout_session_entity_1 = require("../entities/checkout-session.entity");
const typeorm_2 = require("typeorm");
const products_service_1 = require("../products/products.service");
let MercadoPagoWebhooksController = class MercadoPagoWebhooksController {
    constructor(mercadoPagoService, productsService, checkoutRepository) {
        this.mercadoPagoService = mercadoPagoService;
        this.productsService = productsService;
        this.checkoutRepository = checkoutRepository;
    }
    async handlePayment(body, query) {
        const paymentId = body?.data?.id ||
            body?.id ||
            body?.['data.id'] ||
            query?.['data.id'] ||
            query?.id;
        if (!paymentId) {
            return { received: true };
        }
        const accessToken = await this.mercadoPagoService.getAccessToken();
        const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        if (!response.ok) {
            return { received: true };
        }
        const payment = (await response.json());
        if (payment.status !== 'approved' || !payment.preference_id) {
            return { received: true };
        }
        const session = await this.checkoutRepository.findOne({
            where: { preferenceId: payment.preference_id },
        });
        if (!session || session.status === 'approved') {
            return { received: true };
        }
        await this.productsService.decrementStockForItems(session.items);
        session.status = 'approved';
        session.paymentId = String(paymentId);
        await this.checkoutRepository.save(session);
        return { received: true };
    }
};
exports.MercadoPagoWebhooksController = MercadoPagoWebhooksController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MercadoPagoWebhooksController.prototype, "handlePayment", null);
exports.MercadoPagoWebhooksController = MercadoPagoWebhooksController = __decorate([
    (0, common_1.Controller)('webhooks/mercadopago'),
    __param(2, (0, typeorm_1.InjectRepository)(checkout_session_entity_1.CheckoutSession)),
    __metadata("design:paramtypes", [mercadopago_service_1.MercadoPagoService,
        products_service_1.ProductsService,
        typeorm_2.Repository])
], MercadoPagoWebhooksController);
//# sourceMappingURL=webhooks.controller.js.map