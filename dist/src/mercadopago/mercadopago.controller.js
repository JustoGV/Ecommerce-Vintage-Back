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
exports.MercadoPagoController = void 0;
const common_1 = require("@nestjs/common");
const mercadopago_service_1 = require("./mercadopago.service");
const update_mercadopago_config_dto_1 = require("./dto/update-mercadopago-config.dto");
let MercadoPagoController = class MercadoPagoController {
    constructor(mercadoPagoService) {
        this.mercadoPagoService = mercadoPagoService;
    }
    getPublicKey() {
        return this.mercadoPagoService.getPublicConfig();
    }
    getAdminConfig() {
        return this.mercadoPagoService.getAdminConfig();
    }
    saveConfig(dto) {
        return this.mercadoPagoService.saveConfig(dto);
    }
};
exports.MercadoPagoController = MercadoPagoController;
__decorate([
    (0, common_1.Get)('public-key'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MercadoPagoController.prototype, "getPublicKey", null);
__decorate([
    (0, common_1.Get)('config'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MercadoPagoController.prototype, "getAdminConfig", null);
__decorate([
    (0, common_1.Put)('config'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_mercadopago_config_dto_1.UpdateMercadoPagoConfigDto]),
    __metadata("design:returntype", void 0)
], MercadoPagoController.prototype, "saveConfig", null);
exports.MercadoPagoController = MercadoPagoController = __decorate([
    (0, common_1.Controller)('mercadopago'),
    __metadata("design:paramtypes", [mercadopago_service_1.MercadoPagoService])
], MercadoPagoController);
//# sourceMappingURL=mercadopago.controller.js.map