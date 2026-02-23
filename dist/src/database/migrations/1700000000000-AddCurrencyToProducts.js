"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddCurrencyToProducts1700000000000 = void 0;
const typeorm_1 = require("typeorm");
class AddCurrencyToProducts1700000000000 {
    constructor() {
        this.name = 'AddCurrencyToProducts1700000000000';
    }
    async up(queryRunner) {
        await queryRunner.addColumn('products', new typeorm_1.TableColumn({
            name: 'currency',
            type: 'varchar',
            length: '3',
            isNullable: false,
            default: "'ARS'",
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropColumn('products', 'currency');
    }
}
exports.AddCurrencyToProducts1700000000000 = AddCurrencyToProducts1700000000000;
//# sourceMappingURL=1700000000000-AddCurrencyToProducts.js.map