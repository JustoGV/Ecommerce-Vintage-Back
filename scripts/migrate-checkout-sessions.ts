import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';

async function migrateCheckoutSessions() {
  try {
    const app = await NestFactory.createApplicationContext(AppModule);
    const dataSource = app.get(DataSource);

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
  } catch (error) {
    console.error('💥 Error durante la migracion:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  migrateCheckoutSessions();
}

export { migrateCheckoutSessions };
