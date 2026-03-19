import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';

async function migrateMercadoPagoConfig() {
  try {
    const app = await NestFactory.createApplicationContext(AppModule);
    const dataSource = app.get(DataSource);

    console.log('🚀 Iniciando migracion de mercadopago_config...');

    await dataSource.query('CREATE EXTENSION IF NOT EXISTS pgcrypto');

    await dataSource.query(`
      CREATE TABLE IF NOT EXISTS mercadopago_config (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        access_token text NOT NULL,
        public_key text NOT NULL,
        is_active boolean NOT NULL DEFAULT true,
        admin_user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      )
    `);

    await dataSource.query(`
      CREATE INDEX IF NOT EXISTS mercadopago_config_admin_user_id_idx
        ON mercadopago_config(admin_user_id)
    `);

    console.log('✅ Migracion completada');

    await app.close();
    process.exit(0);
  } catch (error) {
    console.error('💥 Error durante la migracion:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  migrateMercadoPagoConfig();
}

export { migrateMercadoPagoConfig };
