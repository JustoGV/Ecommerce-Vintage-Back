"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.migrateCheckoutSessions = migrateCheckoutSessions;
const core_1 = require("@nestjs/core");
const app_module_1 = require("../src/app.module");
const typeorm_1 = require("typeorm");
async function migrateCheckoutSessions() {
    try {
        const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
        const dataSource = app.get(typeorm_1.DataSource);
        console.log('🚀 Iniciando migracion de checkout_sessions...');
        await dataSource.query(`
      CREATE TABLE IF NOT EXISTS checkout_sessions (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        preference_id text NOT NULL UNIQUE,
        items jsonb NOT NULL,
        status text NOT NULL DEFAULT 'pending',
        payment_id text,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      )
    `);
        await dataSource.query(`
      CREATE INDEX IF NOT EXISTS checkout_sessions_status_idx
        ON checkout_sessions(status)
    `);
        console.log('✅ Migracion completada');
        await app.close();
        process.exit(0);
    }
    catch (error) {
        console.error('💥 Error durante la migracion:', error);
        process.exit(1);
    }
}
if (require.main === module) {
    migrateCheckoutSessions();
}
//# sourceMappingURL=migrate-checkout-sessions.js.map